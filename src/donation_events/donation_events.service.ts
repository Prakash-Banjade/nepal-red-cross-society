import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';
import { ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { AddressService } from 'src/address/address.service';
import { extractAddress } from 'src/core/utils/extractAddress';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import getFileName from 'src/core/utils/getImageUrl';
import { FileSystemStoredFile } from 'nestjs-form-data';

@Injectable()
export class DonationEventsService {
  constructor(
    @InjectRepository(DonationEvent)
    private donationEventsRepo: Repository<DonationEvent>,
    @InjectRepository(Volunteer) private volunteersRepo: Repository<Volunteer>,
    private readonly organizationsService: OrganizationsService,
    private readonly addressService: AddressService,
  ) { }

  async create(createDonationEventDto: CreateDonationEventDto) {
    // retrieving volunteers
    const volunteers = createDonationEventDto.volunteers ? await this.volunteersRepo.find({
      where: {
        id: In(createDonationEventDto.volunteers),
      },
    }) : null;

    // retrieving organization
    const organization = await this.organizationsService.findOne(createDonationEventDto.organization)

    // retrieving address
    const address = await this.addressService.create(extractAddress(createDonationEventDto));

    // retrieving cover image
    const coverImage = createDonationEventDto.coverImage ? getFileName(createDonationEventDto.coverImage) : null;

    const donationEvent = this.donationEventsRepo.create({
      ...createDonationEventDto,
      address,
      organization,
      volunteers,
      coverImage,
    })

    return await this.donationEventsRepo.save(donationEvent);
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.donationEventsRepo.createQueryBuilder('donationEvent');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("donationEvent.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.page)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere({ name: ILike(`%${queryDto.search ?? ''}%`) })
      .leftJoinAndSelect('donationEvent.address', 'address')
      .leftJoinAndSelect('donationEvent.organization', 'organization')
      .getMany()

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingEvent = await this.donationEventsRepo.findOne({
      where: { id },
      relations: {
        address: true,
        volunteers: true,
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

    // retrieving volunteers
    const volunteers = updateDonationEventDto.volunteers ? await this.volunteersRepo.find({
      where: {
        id: In(updateDonationEventDto.volunteers),
      },
    }) : existingEvent.volunteers

    // retrieving organization
    const organization = updateDonationEventDto.organization ? await this.organizationsService.findOne(updateDonationEventDto.organization) : existingEvent.organization

    // retrieving cover image
    const coverImage = updateDonationEventDto.coverImage ? getFileName(updateDonationEventDto.coverImage) : existingEvent.coverImage

    // retrieving gallery
    const gallery = !!updateDonationEventDto?.gallery ? this.getGalleryUrls(updateDonationEventDto.gallery) : existingEvent.gallery

    Object.assign(existingEvent, {
      ...updateDonationEventDto,
      volunteers: volunteers,
      organization,
      coverImage,
      gallery,
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
