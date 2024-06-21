import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateBloodBagDto } from './dto/create-blood-bag.dto';
import { UpdateBloodBagDto } from './dto/update-blood-bag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodBag } from './entities/blood-bag.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { CONSTANTS } from 'src/CONSTANTS';
import { RequestUser } from 'src/core/types/global.types';
import { InventoryItemService } from 'src/inventory/inventory-item.service';
import { BloodBagStatus, InventoryTransaction } from 'src/core/types/fieldsEnum.types';
import { BagTypesService } from 'src/bag-types/bag-types.service';

@Injectable()
export class BloodBagsService {

  constructor(
    @InjectRepository(BloodBag) private bloodBagsRepository: Repository<BloodBag>,
    @Inject(forwardRef(() => InventoryService)) private readonly inventoryService: InventoryService,
    private readonly inventoryItemService: InventoryItemService,
    private readonly bagTypeService: BagTypesService,
    private readonly branchService: BagTypesService,

  ) { }
  async create(createBloodBagDto: CreateBloodBagDto, currentUser: RequestUser, createIssueStatement: boolean = true, donationEvent?: DonationEvent) {
    // const existignBloodBagWithSameNo = await this.bloodBagsRepository.findOneBy({ bagNo: createBloodBagDto.bagNo });
    // if (existignBloodBagWithSameNo) throw new BadRequestException('Blood bag with same number already exists');

    // bagtype
    const bagType = await this.bagTypeService.findOne(createBloodBagDto.bagType);

    const inventory = await this.inventoryService.getInventoryByName(CONSTANTS.BLOOD_BAG, currentUser);
    const bloodBagCount = await this.inventoryItemService.getBloodBagsCount(currentUser);

    // check if there is sufficient blood bag in inventory
    if (bagType.name in bloodBagCount && bloodBagCount[bagType.name] <= 0) throw new BadRequestException('Not enough blood bags of type ' + bagType.name);

    // create new blood bag
    let lastBloodBagNo: number;
    if (!createBloodBagDto.bagNo) {
      const lastBloodBag = await this.bloodBagsRepository.findOne({ where: { bagNo: Not(IsNull()) }, order: { bagNo: 'DESC' } });
      lastBloodBagNo = lastBloodBag ? lastBloodBag.bagNo : 0;
    } else {
      lastBloodBagNo = createBloodBagDto.bagNo
    }

    const newBloodBag = this.bloodBagsRepository.create({ bagNo: lastBloodBagNo + 1, bagType: bagType, donationEvent });

    const savedBloodBag = await this.bloodBagsRepository.save(newBloodBag);

    // create blood bag inventory issue statement
    createIssueStatement && await this.createIssueStatement(savedBloodBag, inventory, currentUser);

    return {
      message: 'Blood bag created successfully',
      bloodBag: savedBloodBag
    };
  }

  async createIssueStatement(bloodBag: BloodBag, inventory: any, currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    await this.inventoryItemService.create({
      date: new Date().toISOString(),
      status: BloodBagStatus.USABLE,
      transactionType: InventoryTransaction.ISSUED,
      destination: `${branch.name} Blood Bank`,
      quantity: 1,
      price: 0,
      source: `${branch.name} Blood Bank`,
      inventoryId: inventory.id,
      bagType: bloodBag.bagType?.id,
    }, currentUser);
  }

  async updateBagType(bloodBag: BloodBag, bagTypeId: string) {
    const bagType = await this.bagTypeService.findOne(bagTypeId);

    bloodBag.bagType = bagType;

    return await this.bloodBagsRepository.save(bloodBag);
  }

  async getBloodBagByBagNo(bagNo: number) {
    const bloodBag = await this.bloodBagsRepository.findOne({
      where: { bagNo },
      relations: { bagType: true, donation: true, donationEvent: true },
    });
    if (!bloodBag) throw new BadRequestException('No blood bag found');
    return bloodBag
  }

  // async getLastBloodBagOfEvent(event: DonationEvent) {
  //   const bloodBag = await this.bloodBagsRepository.findOne({
  //     where: {
  //       donationEvent: {
  //         id: event.id
  //       }
  //     },
  //     relations: {
  //       donationEvent: true
  //     },
  //     order: {
  //       bagNo: 'ASC'
  //     }
  //   })
  //   if (!bloodBag) throw new InternalServerErrorException('No blood bag found')

  //   bloodBag.status = BloodBagStatus.USED
  //   return await this.bloodBagsRepository.save(bloodBag)
  // }

  async findAll() {
    return await this.bloodBagsRepository.find();
  }

  async findOne(id: string) {
    const existingBloodBag = await this.bloodBagsRepository.findOneBy({ id });
    if (!existingBloodBag) throw new BadRequestException('Blood bag not found');

    return existingBloodBag;
  }

  async update(id: string, updateBloodBagDto: UpdateBloodBagDto) {
    return `This action updates a #${id} bloodBag`;
  }

  async remove(id: string) {
    return `This action removes a #${id} bloodBag`;
  }
}
