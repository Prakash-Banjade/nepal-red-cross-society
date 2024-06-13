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

@Injectable()
export class DonationEventsService {
  constructor(
    @InjectRepository(DonationEvent)
    private donationEventsRepo: Repository<DonationEvent>,
    @InjectRepository(Technician) private techniciansRepo: Repository<Technician>,
    private readonly organizationsService: OrganizationsService,
    private readonly addressService: AddressService,
    private readonly bloodBagService: BloodBagsService,
  ) { }

  async create(createDonationEventDto: CreateDonationEventDto, currentUser: RequestUser) {
    const expectedDonation = this.extractJSONArray(createDonationEventDto.expectedDonations);

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

    // creating bloodBags
    await this.bloodBagService.createBloodBagsInBulk(expectedDonation, savedEvent, currentUser);
  }

  extractJSONArray(expectedDonations: string): Record<string, number>[] {
    try {
      return JSON.parse(expectedDonations);
    } catch (e) {
      throw new BadRequestException('Expected Donations must be an array');
    }
  }

  // async canHaveDonation(eventId: string) {
  //   const event = await this.findOne(eventId);
  //   if (event.donations.length >= event.expectedDonations) throw new BadRequestException('Donation event can not have more than expected donations');
  // }

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
      .leftJoinAndSelect('donationEvent.bloodBag', 'bloodBag')
      .andWhere(new Brackets(qb => {
        if (queryDto.country) qb.andWhere("LOWER(address.country) LIKE LOWER(:country)", { country: `%${queryDto.country ?? ''}%` });
        if (queryDto.province) qb.andWhere("LOWER(address.province) LIKE LOWER(:province)", { province: `%${queryDto.province ?? ''}%` });
        if (queryDto.district) qb.andWhere("LOWER(address.district) LIKE LOWER(:district)", { district: `%${queryDto.district ?? ''}%` });
        if (queryDto.municipality) qb.andWhere("LOWER(address.municipality) LIKE LOWER(:municipality)", { municipality: `%${queryDto.municipality ?? ''}%` });
        if (queryDto.ward) qb.andWhere("LOWER(address.ward) LIKE LOWER(:ward)", { ward: `%${queryDto.ward ?? ''}%` });
        if (queryDto.street) qb.andWhere("LOWER(address.street) LIKE LOWER(:street)", { street: `%${queryDto.street ?? ''}%` });
      }))
      .andWhere(new Brackets(qb => {
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
