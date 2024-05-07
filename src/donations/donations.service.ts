import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { Repository } from 'typeorm';
import { Donor } from 'src/donors/entities/donor.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { Certificate } from 'src/certificate/entities/certificate.entity';
import { LabReport } from 'src/lab_reports/entities/lab_report.entity';

@Injectable()
export class DonationsService {

  constructor(
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    @InjectRepository(Donor) private donorRepo: Repository<Donor>,
    @InjectRepository(Organization) private organizationRepo: Repository<Organization>,
    @InjectRepository(DonationEvent) private donationEventRepo: Repository<DonationEvent>,
    @InjectRepository(Certificate) private certificateRepo: Repository<Certificate>,
    @InjectRepository(LabReport) private labReportRepo: Repository<LabReport>,
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
    const donor = createDonationDto.donor ? await this.donorRepo.findOneBy({ id: createDonationDto.donor }) : null;
    const organization = createDonationDto.organization ? await this.organizationRepo.findOneBy({ id: createDonationDto.organization }) : null;
    const donationEvent = createDonationDto.donation_event ? await this.donationEventRepo.findOneBy({ id: createDonationDto.donation_event }) : null;

    return { donor, organization, donation_event: donationEvent };
  }

  private async retrieveUpdateDependencies(updateDonationDto: UpdateDonationDto) {
    const donor = updateDonationDto.donor ? await this.donorRepo.findOneBy({ id: updateDonationDto.donor }) : null;
    const organization = updateDonationDto.organization ? await this.organizationRepo.findOneBy({ id: updateDonationDto.organization }) : null;
    const donationEvent = updateDonationDto.donation_event ? await this.donationEventRepo.findOneBy({ id: updateDonationDto.donation_event }) : null;
    const certificate = updateDonationDto.certificate ? await this.certificateRepo.findOneBy({ id: updateDonationDto.certificate }) : null;
    const labReport = updateDonationDto.labReport ? await this.labReportRepo.findOneBy({ id: updateDonationDto.labReport }) : null;

    return { donor, organization, donation_event: donationEvent, certificate, labReport };
  }
}
