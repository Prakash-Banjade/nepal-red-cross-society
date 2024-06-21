import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBloodRequestDto } from './dto/create-blood_request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood_request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { Deleted } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodRequestQueryDto } from './dto/blood-request-query.dto';
import { BloodInventoryService } from 'src/inventory/blood-inventory.service';
import getFileName from 'src/core/utils/getImageUrl';
import { RequestUser } from 'src/core/types/global.types';
import { BranchService } from 'src/branch/branch.service';
import { ServiceChargeService } from 'src/service-charge/service-charge.service';
import { BloodRequestCharge } from './entities/blood-request-charge.entity';
import { RequestedBloodBag } from './entities/requestedBloodBag.entity';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { BloodRequestsRepository } from './repository/blood_request.repository';
import { BloodRequestsChargeRepository } from './repository/blood_request_charge.repository';
import { RequestedBloodBagRepository } from './repository/requestedBloodBag.repository';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectRepository(BloodRequest) private readonly bloodRequestRepo: Repository<BloodRequest>,
    @InjectRepository(BloodRequestCharge) private readonly bloodRequestChargeRepo: Repository<BloodRequestCharge>,
    @InjectRepository(RequestedBloodBag) private readonly requestedBloodBagRepo: Repository<RequestedBloodBag>,
    private readonly bloodInventoryService: BloodInventoryService,
    private readonly branchService: BranchService,
    private readonly serviceChargeService: ServiceChargeService,
    private readonly hospitalService: HospitalsService,
    private readonly bloodRequestsRepository: BloodRequestsRepository,
    private readonly bloodRequestChargesRepository: BloodRequestsChargeRepository,
    private readonly requestedBloodBagRepository: RequestedBloodBagRepository,
  ) { }

  async create(createBloodRequestDto: CreateBloodRequestDto, currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    const hospital = await this.hospitalService.findOne(createBloodRequestDto.hospitalId);

    // VALIDATE BLOOD INVENTORIES
    await this.bloodInventoryService.checkIfBloodAvailableForRequest(createBloodRequestDto, currentUser);

    const documentFront = getFileName(createBloodRequestDto.documentFront);
    const documentBack = getFileName(createBloodRequestDto.documentBack);

    // CREATE BILL NO.
    const lastBloodRequest = await this.bloodRequestRepo.findOne({ where: { deletedAt: Not(IsNull()) }, order: { createdAt: 'DESC' }, select: { billNo: true } });
    const billNo = lastBloodRequest ? lastBloodRequest.billNo + 1 : 1

    const createdRequest = this.bloodRequestRepo.create({
      ...createBloodRequestDto,
      documentFront,
      documentBack,
      billNo,
      hospital,
    });

    const savedRequest = await this.bloodRequestsRepository.saveBloodRequest(createdRequest); // TRANSACTION

    // CREATE BLOOD REQUEST CHARGES
    await this.createBloodRequestCharge(savedRequest, createBloodRequestDto);

    // CREATE BLOOD ISSUE STATEMENTS
    await this.bloodInventoryService.createIssueStatements({
      inventoryIds: createBloodRequestDto.inventoryIds,
      date: new Date().toISOString(),
      source: `${branch.name} Blood Bank`,
      destination: hospital.name,
      price: 0,
    }, currentUser);

    // CREATE REQUESTED BLOOD BAGS IN BLOOD REQUEST
    for (const inventoryId of createBloodRequestDto.inventoryIds) {
      const { bloodBag } = await this.bloodInventoryService.findOne(inventoryId, currentUser);

      const requestedBloodBag = this.requestedBloodBagRepo.create({ bloodBag, bloodRequest: savedRequest });
      await this.requestedBloodBagRepository.saveRequestedBloodBag(requestedBloodBag); // TRANSACTION
    }
  }

  async createBloodRequestCharge(bloodRequest: BloodRequest, bloodRequestDto: CreateBloodRequestDto) {
    for (const charge of bloodRequestDto.charges) {
      const serviceCharge = await this.serviceChargeService.findOne(charge.serviceCharge);
      const bloodRequestCharge = this.bloodRequestChargeRepo.create({
        quantity: +charge.quantity,
        serviceCharge,
        bloodRequest
      })

      await this.bloodRequestChargesRepository.saveCharge(bloodRequestCharge); // TRANSACTION
    }
  }

  async findAll(queryDto: BloodRequestQueryDto) {
    const queryBuilder = this.bloodRequestRepo.createQueryBuilder('bloodRequest');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("bloodRequest.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect('bloodRequest.bloodRequestCharges', 'bloodRequestCharges')
      .leftJoinAndSelect('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .andWhere(new Brackets(qb => {
        qb.where([
          { patientName: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        queryDto.bloodType && qb.andWhere({ bloodType: queryDto.bloodType });
        queryDto.rhFactor && qb.andWhere({ rhFactor: queryDto.rhFactor })
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingRequest = await this.bloodRequestRepo.findOne({
      where: { id },
      relations: { requestedBloodBags: true, bloodRequestCharges: true },
    });
    if (!existingRequest) throw new BadRequestException('Request not found');

    return existingRequest;
  }

  async update(id: string, updateBloodRequestDto: UpdateBloodRequestDto) {
    const { bloodType, rhFactor } = updateBloodRequestDto;
    // await this.bloodInventoryService.checkIfBloodAvailable(bloodType, rhFactor, bloodItems); // check if blood is available

    const existingRequest = await this.findOne(id);
    Object.assign(existingRequest, updateBloodRequestDto);

    return await this.bloodRequestRepo.save(existingRequest);
  }

  async remove(ids: string[]) {
    const foundBloodRequests = await this.bloodRequestRepo.find({
      where: {
        id: In(ids)
      }
    })
    await this.bloodRequestRepo.softRemove(foundBloodRequests);

    return {
      success: true,
      message: 'Blood Requests deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingBloodRequests = await this.bloodRequestRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingBloodRequests) throw new BadRequestException('Blood Request not found');

    return await this.bloodRequestRepo.restore(ids);
  }

  async clearTrash() {
    return await this.bloodRequestRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
