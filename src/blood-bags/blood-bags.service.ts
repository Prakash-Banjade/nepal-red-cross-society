import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { BagType } from 'src/bag-types/entities/bag-type.entity';

@Injectable()
export class BloodBagsService {

  constructor(
    @InjectRepository(BloodBag) private bloodBagsRepository: Repository<BloodBag>,
    @Inject(forwardRef(() => InventoryService)) private readonly inventoryService: InventoryService,
    private readonly inventoryItemService: InventoryItemService,
    private readonly bagTypeService: BagTypesService,

  ) { }
  async create(createBloodBagDto: CreateBloodBagDto, currentUser: RequestUser, createIssueStatement: boolean = true, donationEvent?: DonationEvent) {
    // const existignBloodBagWithSameNo = await this.bloodBagsRepository.findOneBy({ bagNo: createBloodBagDto.bagNo });
    // if (existignBloodBagWithSameNo) throw new BadRequestException('Blood bag with same number already exists');

    // bagtype
    const bagType = await this.bagTypeService.findOne(createBloodBagDto.bagType);

    // check if there is sufficient blood bag in inventory
    const inventory = await this.inventoryService.getInventoryByName(CONSTANTS.BLOOD_BAG, currentUser);
    if (typeof inventory.bloodBagCount[bagType.name] === "undefined" || inventory.bloodBagCount[bagType.name][BloodBagStatus.USABLE] <= 0) throw new BadRequestException('Not enough blood bags of type ' + bagType.name);

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
    await this.inventoryItemService.create({
      date: new Date().toISOString(),
      status: BloodBagStatus.USABLE,
      transactionType: InventoryTransaction.ISSUED,
      destination: CONSTANTS.SELF,
      quantity: 1,
      price: 0,
      source: CONSTANTS.SELF,
      inventoryId: inventory.id,
      bagType: bloodBag.bagType?.id,
    }, currentUser);
  }

  // async createNewBloog() {
  //   const lastBloodBag = await this.bloodBagsRepository.findOne({ order: { bagNo: 'DESC' } });

  //   let lastBloodBagNo = lastBloodBag ? lastBloodBag.bagNo : 1;
  //   const newBloodBag = this.bloodBagsRepository.create({ bagNo: lastBloodBagNo + 1 });

  //   return await this.bloodBagsRepository.save(newBloodBag);
  // }

  async createBloodBagsInBulk(expectedDonations: Record<string, number>[], donationEvent: DonationEvent, currentUser: RequestUser) {
    if (expectedDonations.length <= 0) throw new BadRequestException('Quantity must be greater than 0');

    const inventoryId = await this.checkSufficientBloodBags(expectedDonations, currentUser); // check if there is enough blood bags

    const lastBloodBag = await this.bloodBagsRepository.findOne({ where: { bagNo: Not(IsNull()) }, order: { bagNo: 'DESC' } });

    const totalBloodBagsNeeded = expectedDonations.reduce((acc, curr) => acc + curr[1], 0); // adding the quantity of each blood bag, second value

    let lastBloodBagNo = lastBloodBag ? lastBloodBag.bagNo : 0;
    for (let i = 0; i < totalBloodBagsNeeded; i++) {
      const bagNo = lastBloodBagNo + i;

      const newBloodBag = this.bloodBagsRepository.create({ bagNo, donationEvent }); // creating blood bags with no type assigned now, bagType will be assigned on donation
      await this.bloodBagsRepository.save(newBloodBag);
    }

    // TODO: remove blood bags from inventory instantly or after donation added?

    // create blood bags issue statement in inventory
    await this.inventoryItemService.create({
      date: new Date().toISOString(),
      status: BloodBagStatus.USABLE,
      transactionType: InventoryTransaction.ISSUED,
      destination: donationEvent.name,
      quantity: expectedDonations?.reduce((acc, curr) => acc + curr[1], 0),
      price: 0,
      source: CONSTANTS.SELF,
      inventoryId,
    }, currentUser)
  }

  async checkSufficientBloodBags(expectedDonations: Record<string, number>[], currentUser: RequestUser) {
    const inventory = await this.inventoryService.getInventoryByName(CONSTANTS.BLOOD_BAG, currentUser)

    const bloodBagCount = inventory.bloodBagCount;

    for (const [key, value] of Object.entries(expectedDonations)) {
      if (!bloodBagCount[key][BloodBagStatus.USABLE] || bloodBagCount[key][BloodBagStatus.USABLE] < value) throw new BadRequestException('Not enough blood bags of type ' + key);
    }

    return inventory.id
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
