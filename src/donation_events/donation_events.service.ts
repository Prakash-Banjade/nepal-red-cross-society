import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';
import { In, Repository } from 'typeorm';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { AddressService } from 'src/address/address.service';

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
    const volunteers = await this.volunteersRepo.find({
      where: {
        id: In(createDonationEventDto.volunteers),
      },
    });

    // retrieving organization
    const organization = await this.organizationsService.findOne(createDonationEventDto.organization)

    // retrieving address
    const address = await this.addressService.create(this.extractAddress(createDonationEventDto));

    const donationEvent = this.donationEventsRepo.create({
      ...createDonationEventDto,
      address: address,
      organization: organization,
      volunteers: volunteers,
      gallery: [], // TODO: implement gallery
      coverImage: '', // TODO: implement cover image
    })

    return await this.donationEventsRepo.save(donationEvent);
  }

  async findAll() {
    return await this.donationEventsRepo.find();
  }

  async findOne(id: string) {
    const existingEvent = await this.donationEventsRepo.findOne({
      where: { id },
      relations: { address: true },
    });
    if (!existingEvent) throw new NotFoundException('Event not found');

    return existingEvent;
  }

  async update(id: string, updateDonationEventDto: UpdateDonationEventDto) {
    const existingEvent = await this.findOne(id);

    // setting if address is updated
    await this.addressService.update(existingEvent.address.id, this.extractAddress(updateDonationEventDto))

    // retrieving volunteers
    const volunteers = await this.volunteersRepo.find({
      where: {
        id: In(updateDonationEventDto.volunteers),
      },
    });

    // retrieving organization
    const organization = updateDonationEventDto.organization ? await this.organizationsService.findOne(updateDonationEventDto.organization) : existingEvent.organization

    Object.assign(existingEvent, {
      ...updateDonationEventDto,
      volunteers: volunteers,
      organization,
    });

    // TODO: implement gallery, cover image

    return await this.donationEventsRepo.save(existingEvent);    
  }

  async remove(id: string) {
    const existingEvent = await this.findOne(id);
    await this.donationEventsRepo.softRemove(existingEvent);

    return {
      success: true,
      message: 'Event deleted successfully',
    }
  }

  public extractAddress(dto: CreateDonationEventDto | UpdateDonationEventDto) {
    const { country, province, district, municipality, ward, street } = dto;
    return { country, province, district, municipality, ward, street };
  }

}
