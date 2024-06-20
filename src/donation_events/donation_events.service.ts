import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { Technician } from 'src/technicians/entities/technician.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { AddressService } from 'src/address/address.service';
import { extractAddress } from 'src/core/utils/extractAddress';
import { Deleted } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import getFileName from 'src/core/utils/getImageUrl';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { EventQueryDto } from './dto/event-query.dto';
import { BloodBagsService } from 'src/blood-bags/blood-bags.service';
import { RequestUser } from 'src/core/types/global.types';
import { CONSTANTS } from 'src/CONSTANTS';
import { InventoryService } from 'src/inventory/inventory.service';
import { InventoryItemService } from 'src/inventory/inventory-item.service';
import { BloodBagStatus, InventoryTransaction } from 'src/core/types/fieldsEnum.types';
import { BagTypesService } from 'src/bag-types/bag-types.service';

@Injectable()
export class DonationEventsService {
  constructor(
    @InjectRepository(DonationEvent)
    private donationEventsRepo: Repository<DonationEvent>,
    @InjectRepository(Technician) private techniciansRepo: Repository<Technician>,
    private readonly organizationsService: OrganizationsService,
    private readonly addressService: AddressService,
    private readonly bloodBagService: BloodBagsService,
    private readonly inventoryService: InventoryService,
    private readonly inventoryItemService: InventoryItemService,
    private readonly bagTypeService: BagTypesService
  ) { }

  async create(createDonationEventDto: CreateDonationEventDto, currentUser: RequestUser) {
    // retrieving technicians
    const technicians = createDonationEventDto.technicians ? await this.techniciansRepo.find({
      where: {
        id: In(createDonationEventDto.technicians),
      },
    }) : null;

    // retrieving organization
    const organization = await this.organizationsService.findOne(createDonationEventDto.organization)

    // retrieving address
    const address = await this.addressService.create(extractAddress(createDonationEventDto));

    // retrieving images
    const coverImage = createDonationEventDto.document ? getFileName(createDonationEventDto.coverImage) : null;
    const document = getFileName(createDonationEventDto.document);

    const donationEvent = this.donationEventsRepo.create({
      ...createDonationEventDto,
      address,
      organization,
      technicians,
      coverImage,
      document,
    })

    const savedEvent = await this.donationEventsRepo.save(donationEvent);

    return savedEvent;
  }

  jsonParse(stringifiedJson: string): Record<string, number | Record<string, number>> {
    try {
      return JSON.parse(stringifiedJson);
    } catch (e) {
      throw new BadRequestException('Failed to parse string to array');
    }
  }

  async canHaveDonation(eventId: string) {
    const event = await this.findOne(eventId);
    if (event.donations.length >= event.expectedDonations) throw new BadRequestException('Donation event can not have more than expected donations');
  }

  async findAll(queryDto: EventQueryDto) {
    const queryBuilder = this.donationEventsRepo.createQueryBuilder('donationEvent');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("donationEvent.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .leftJoinAndSelect('donationEvent.organization', 'organization')
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { name: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        if (queryDto.search) qb.orWhere("LOWER(organization.name) LIKE LOWER(:organizationName)", { organizationName: `%${queryDto.search ?? ''}%` });
      }))
      .leftJoinAndSelect('donationEvent.address', 'address')
      // .leftJoinAndSelect('donationEvent.bloodBag', 'bloodBag')
      .andWhere(new Brackets(qb => {
        if (queryDto.country) qb.andWhere("LOWER(address.country) LIKE LOWER(:country)", { country: `%${queryDto.country ?? ''}%` });
        if (queryDto.province) qb.andWhere("LOWER(address.province) LIKE LOWER(:province)", { province: `%${queryDto.province ?? ''}%` });
        if (queryDto.district) qb.andWhere("LOWER(address.district) LIKE LOWER(:district)", { district: `%${queryDto.district ?? ''}%` });
        if (queryDto.municipality) qb.andWhere("LOWER(address.municipality) LIKE LOWER(:municipality)", { municipality: `%${queryDto.municipality ?? ''}%` });
        if (queryDto.ward) qb.andWhere("LOWER(address.ward) LIKE LOWER(:ward)", { ward: `%${queryDto.ward ?? ''}%` });
        if (queryDto.street) qb.andWhere("LOWER(address.street) LIKE LOWER(:street)", { street: `%${queryDto.street ?? ''}%` });
        if (queryDto.status) qb.andWhere("LOWER(donationEvent.status) LIKE LOWER(:status)", { status: `%${queryDto.status ?? ''}%` });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingEvent = await this.donationEventsRepo.findOne({
      where: { id },
      relations: {
        address: true,
        technicians: true,
        donations: true,
        organization: true
      },
    });
    if (!existingEvent) throw new NotFoundException('Event not found');

    return existingEvent;
  }

  async update(id: string, updateDonationEventDto: UpdateDonationEventDto) {
    const existingEvent = await this.findOne(id);

    // setting if address is updated
    await this.addressService.update(existingEvent.address.id, extractAddress(updateDonationEventDto))

    // retrieving technicians
    const technicians = updateDonationEventDto.technicians ? await this.techniciansRepo.find({
      where: {
        id: In(updateDonationEventDto.technicians),
      },
    }) : existingEvent.technicians

    // retrieving organization
    const organization = updateDonationEventDto.organization ? await this.organizationsService.findOne(updateDonationEventDto.organization) : existingEvent.organization

    // retrieving cover image
    const coverImage = updateDonationEventDto.coverImage ? getFileName(updateDonationEventDto.coverImage) : existingEvent.coverImage

    // retrieving document
    const document = updateDonationEventDto.document ? getFileName(updateDonationEventDto.document) : existingEvent.document

    // retrieving gallery
    const gallery = !!updateDonationEventDto?.gallery ? this.getGalleryUrls(updateDonationEventDto.gallery) : existingEvent.gallery

    Object.assign(existingEvent, {
      ...updateDonationEventDto,
      technicians: technicians,
      organization,
      coverImage,
      gallery,
      document,
    });

    return await this.donationEventsRepo.save(existingEvent);
  }

  async updateRequiredInventoryItems(id: string, inventoryItems: string, currentUser: RequestUser) {
    /*
      {
        scissor: 6,
        bagSet: 6,
        bloodBag: {
          single: 5,
          triple: 1,
        }
      }
    */
    const inventoryItemsArray = this.jsonParse(inventoryItems)
    const existingEvent = await this.findOne(id);
    let createdBloodBagNo: string[] = []

    // check if blood bags are requested more than expectedDonations
    let requestedBloodBags: number = 0
    for (const [_, value] of Object.entries(inventoryItemsArray[CONSTANTS.BLOOD_BAG_KEY] as Record<string, number>)) requestedBloodBags += value
    if (existingEvent.expectedDonations < requestedBloodBags) throw new BadRequestException("You can't request more blood bags than expected donations");

    // extracting blood bags count
    const bloodBagCount = await this.inventoryItemService.getBloodBagsCount(currentUser)

    // checking if inventory items are sufficient
    for (const [key, value] of Object.entries(inventoryItemsArray)) {
      if (key === CONSTANTS.BLOOD_BAG_KEY) { // checking quantity of blood bags
        for (const [key, quantity] of Object.entries(value as Record<string, number>)) {
          // if (!(key in bloodBagCount) || !bloodBagCount[key][BloodBagStatus.USABLE] || bloodBagCount[key][BloodBagStatus.USABLE] < quantity) throw new BadRequestException('Not enough blood bags of type ' + key);
          if (key in bloodBagCount && bloodBagCount[key] < quantity) throw new BadRequestException('Not enough blood bags of type ' + key);
        }
      } else {
        const inventory = await this.inventoryService.getInventoryByName(key, currentUser)
        if (typeof value === 'number' && inventory.quantity < value) throw new BadRequestException('Not enough ' + key);
      }
    }

    // generate inventory issue statement for inventory items
    for (const [key, value] of Object.entries(inventoryItemsArray)) {
      const inventory = await this.inventoryService.getInventoryByName(key === CONSTANTS.BLOOD_BAG_KEY ? CONSTANTS.BLOOD_BAG : key, currentUser)
      if (key === CONSTANTS.BLOOD_BAG_KEY) { // checking quantity of blood bags
        for (const [key, quantity] of Object.entries(value as Record<string, number>)) {
          // evaluate bagType
          const bagType = await this.bagTypeService.findBagTypeByName(key)

          // generate issue statement for each blood bag type
          await this.inventoryItemService.create({
            date: new Date().toISOString(),
            destination: existingEvent.name + ' - ' + existingEvent.organization.name,
            inventoryId: inventory.id,
            price: 0,
            quantity,
            source: CONSTANTS.SELF,
            status: BloodBagStatus.USABLE,
            transactionType: InventoryTransaction.ISSUED,
            bagType: bagType.id,
          }, currentUser)

          // also create blood bag
          for (let i = 0; i < quantity; i++) {
            const newBloodBag = await this.bloodBagService.create({ bagType: bagType.id, }, currentUser, false, existingEvent)
            const { bagNo } = newBloodBag.bloodBag

            createdBloodBagNo.push(`${bagNo}-${bagType.name}`)
          }
        }
      } else {
        await this.inventoryItemService.create({
          date: new Date().toISOString(),
          destination: existingEvent.name + ' - ' + existingEvent.organization.name,
          inventoryId: inventory.id,
          price: 0,
          quantity: value as number,
          source: CONSTANTS.SELF,
          transactionType: InventoryTransaction.ISSUED,
        }, currentUser)
      }
    }

    existingEvent.assignedBloodBags = existingEvent?.assignedBloodBags?.length ? [...existingEvent.assignedBloodBags, ...createdBloodBagNo] : createdBloodBagNo;

    // <--------------- UPDATE INVENTORY ITEMS FOR DONATION EVENT, ALSO ADD MORE ITEMS - STARTS ----------------->
    let newInventoryItems = this.jsonParse(existingEvent.inventoryItems) ?? {}

    for (const [key, value] of Object.entries(inventoryItemsArray)) {
      if (!key || !value) continue;

      if (key === CONSTANTS.BLOOD_BAG_KEY) { // handle blood bag items
        for (const [key, quantity] of Object.entries(value as Record<string, number>)) {
          // console.log('hi there', Date.now(), newInventoryItems[CONSTANTS.BLOOD_BAG_KEY])
          if (CONSTANTS.BLOOD_BAG_KEY in newInventoryItems && key in (newInventoryItems[CONSTANTS.BLOOD_BAG_KEY] as Record<string, number>)) {
            newInventoryItems[CONSTANTS.BLOOD_BAG_KEY][key] += +quantity
          } else {
            newInventoryItems = {
              ...newInventoryItems,
              [CONSTANTS.BLOOD_BAG_KEY]: {
                ...(newInventoryItems[CONSTANTS.BLOOD_BAG_KEY] as Record<string, number>),
                [key]: quantity
              }
            }
          }
        }
      } else { // handle non blood bag items
        if (key in newInventoryItems) {
          newInventoryItems[key] = +newInventoryItems[key] + +value
        } else {
          newInventoryItems[key] = value
        }
      }
    }

    existingEvent.inventoryItems = JSON.stringify(newInventoryItems)
    // <--------------- UPDATE INVENTORY ITEMS, ALSO ADD MORE ITEMS - ENDS ----------------->

    await this.donationEventsRepo.save(existingEvent);

    return {
      message: 'Inventory items issued successfully',
      eventId: existingEvent.id,
      eventName: existingEvent.name,
    }
  }

  async remove(ids: string[]) {
    const foundDonationEvents = await this.donationEventsRepo.find({
      where: {
        id: In(ids)
      }
    })
    await this.donationEventsRepo.softRemove(foundDonationEvents);

    return {
      success: true,
      message: 'DonationEvents deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingDonationEvents = await this.donationEventsRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingDonationEvents) throw new BadRequestException('DonationEvent not found');

    return await this.donationEventsRepo.restore(ids);
  }

  async clearTrash() {
    return await this.donationEventsRepo.delete({
      deletedAt: Not(IsNull())
    })
  }

  private getGalleryUrls(gallery: (FileSystemStoredFile | string)[]) {
    if (gallery instanceof Array) {
      return gallery.map(image => getFileName(image))
    }
    return null;
  }

}
