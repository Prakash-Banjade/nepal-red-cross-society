import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { Repository } from 'typeorm';
import { Certificate } from 'src/certificate/entities/certificate.entity';
import { DonorsService } from 'src/donors/donors.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { DonationEventsService } from 'src/donation_events/donation_events.service';
import { LabReportsService } from 'src/lab_reports/lab_reports.service';
import { CertificateService } from 'src/certificate/certificate.service';

@Injectable()
export class DonationsService {

  constructor(
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    private readonly certificateService: CertificateService,
    private readonly labReportsService: LabReportsService,
    private readonly donationEventsService: DonationEventsService,
    private readonly donorsService: DonorsService,
    private readonly organizationsService: OrganizationsService,
  ) { }

  async create(createDonationDto: CreateDonationDto) {
    const foundDonationWithSameBloodBagNo = await this.donationRepo.findOneBy({ bloodBagNo: createDonationDto.bloodBagNo });
    if (foundDonationWithSameBloodBagNo) throw new BadRequestException('Donation with same blood bag number already exists');

    // finding dependent entities
    const dependentColumns = await this.retrieveCreateDependencies(createDonationDto);

    // create donation
    const donation = this.donationRepo.create({
      ...createDonationDto,
      ...dependentColumns,
    })

    return await this.donationRepo.save(donation);
  }

  async findAll() {
    return await this.donationRepo.find();
  }

  async findOne(id: string) {
    const foundDonation = await this.donationRepo.findOneBy({ id });
    if (!foundDonation) throw new BadRequestException('Donation not found');

    return foundDonation;
  }

  async update(id: string, updateDonationDto: UpdateDonationDto) {
    const foundDonation = await this.findOne(id);

    // retrieving dependent entities
    const dependentColumns = await this.retrieveUpdateDependencies(updateDonationDto);

    // update donation
    Object.assign(foundDonation, {
      ...updateDonationDto,
      ...dependentColumns,
    })

    return await this.donationRepo.save(foundDonation);
  }

  async remove(id: string) {
    const foundDonation = await this.findOne(id);
    await this.donationRepo.softRemove(foundDonation);

    return {
      success: true,
      message: 'Donation deleted successfully',
    }
  }

  private async retrieveCreateDependencies(createDonationDto: CreateDonationDto) {
    const donor = await this.donorsService.findOne(createDonationDto.donor);
    const organization = await this.organizationsService.findOne(createDonationDto.organization);
    const donationEvent = await this.donationEventsService.findOne(createDonationDto.donation_event);

    return { donor, organization, donation_event: donationEvent };
  }

  private async retrieveUpdateDependencies(updateDonationDto: UpdateDonationDto) {
    const donor = await this.donorsService.findOne(updateDonationDto.donor);
    const organization = await this.organizationsService.findOne(updateDonationDto.organization);
    const donationEvent = await this.donationEventsService.findOne(updateDonationDto.donation_event);
    const certificate = await this.certificateService.findOne(updateDonationDto.certificate);
    const labReport = await this.labReportsService.findOne(updateDonationDto.labReport);

    return { donor, organization, donation_event: donationEvent, certificate, labReport };
  }
}
