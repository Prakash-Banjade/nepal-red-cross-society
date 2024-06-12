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

@Injectable()
export class BloodBagsService {

  constructor(
    @InjectRepository(BloodBag) private bloodBagsRepository: Repository<BloodBag>,
    @Inject(forwardRef(() => InventoryService)) private readonly inventoryService: InventoryService,
    private readonly inventoryItemService: InventoryItemService,
    private readonly bagTypeService: BagTypesService,

  ) { }
  async create(createBloodBagDto: CreateBloodBagDto) {
    const existignBloodBagWithSameNo = await this.bloodBagsRepository.findOneBy({ bagNo: createBloodBagDto.bagNo });
    if (existignBloodBagWithSameNo) throw new BadRequestException('Blood bag with same number already exists');

    // bagtype
    const bagType = await this.bagTypeService.findOne(createBloodBagDto.bagType);

    return await this.bloodBagsRepository.save(({
      ...createBloodBagDto,
      bagType: bagType,
    }));
  }

  // async createNewBloog() {
  //   const lastBloodBag = await this.bloodBagsRepository.findOne({ order: { bagNo: 'DESC' } });

  //   let lastBloodBagNo = lastBloodBag ? lastBloodBag.bagNo : 1;
  //   const newBloodBag = this.bloodBagsRepository.create({ bagNo: lastBloodBagNo + 1 });

  //   return await this.bloodBagsRepository.save(newBloodBag);
  // }

  async createBloodBagsInBulk(quantity: number, donationEvent: DonationEvent, currentUser: RequestUser) {
    if (quantity <= 0) throw new BadRequestException('Quantity must be greater than 0');

    const inventoryId = await this.checkSufficientBloodBags(quantity, currentUser); // check if there is enough blood bags

    const lastBloodBag = await this.bloodBagsRepository.findOne({ where: { bagNo: Not(IsNull()) }, order: { bagNo: 'DESC' } });

    let lastBloodBagNo = lastBloodBag ? lastBloodBag.bagNo : 1;
    for (let i = 0; i < quantity; i++) {
      const bagNo = lastBloodBagNo + i;

      const newBloodBag = this.bloodBagsRepository.create({ bagNo, donationEvent });
      await this.bloodBagsRepository.save(newBloodBag);
    }

    // create blood bags issue statement in inventory
    await this.inventoryItemService.create({
      date: new Date().toISOString(),
      transactionType: InventoryTransaction.ISSUED,
      destination: donationEvent.name,
      quantity: quantity,
      price: 0,
      source: CONSTANTS.SELF,
      inventoryId,
    }, currentUser)
  }

  async checkSufficientBloodBags(expectedDonations: number, currentUser: RequestUser) {
    const inventory = await this.inventoryService.getInventoryByName(CONSTANTS.BLOOD_BAG, currentUser)

    if (inventory.quantity < expectedDonations) throw new BadRequestException('Not enough blood bags');

    return inventory.id
  }

  async getBloodBagByBagNo(bagNo: number) {
    const bloodBag = await this.bloodBagsRepository.findOneBy({ bagNo });
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
