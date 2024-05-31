import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { DonorsService } from 'src/donors/donors.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { DonationEventsService } from 'src/donation_events/donation_events.service';
import { Deleted } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { Donor } from 'src/donors/entities/donor.entity';
import { DonationQueryDto } from './dto/donation-query.dto';

@Injectable()
export class DonationsService {

  constructor(
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    private readonly donationEventsService: DonationEventsService,
    private readonly donorsService: DonorsService,
    private readonly organizationsService: OrganizationsService,
  ) { }

  async create(createDonationDto: CreateDonationDto) {
    const foundDonationWithSameBloodBagNo = await this.donationRepo.findOneBy({ bloodBagNo: createDonationDto.bloodBagNo });
    if (foundDonationWithSameBloodBagNo) throw new BadRequestException('Donation with same blood bag number already exists');

    // finding dependent entities
    const dependentColumns = await this.retrieveDependencies(createDonationDto);

    // check if donor can donate (checking if last donation has crossed 3 months)
    this.checkIfEligibleDonor(dependentColumns.donor);

    // create donation
    const donation = this.donationRepo.create({
      ...createDonationDto,
      ...dependentColumns,
    })

    return await this.donationRepo.save(donation);
  }

  async findAll(queryDto: DonationQueryDto) {
    const queryBuilder = this.donationRepo.createQueryBuilder('donation');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    const skipPagination: Boolean = !!(queryDto.search || queryDto.status || queryDto.donationType)

    queryBuilder
      .orderBy("donation.createdAt", queryDto.order)
      .skip(skipPagination ? undefined : queryDto.skip)
      .take(skipPagination ? undefined : queryDto.take)
      .leftJoinAndSelect('donation.donor', 'donor')
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { bloodBagNo: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        if (queryDto.search) qb.orWhere("LOWER(donor.firstName) LIKE LOWER(:donorFirstName)", { donorFirstName: `%${queryDto.search ?? ''}%` });
        if (queryDto.search) qb.orWhere("LOWER(donor.lastName) LIKE LOWER(:donorLastName)", { donorLastName: `%${queryDto.search ?? ''}%` });
      }))
      .andWhere(new Brackets(qb => {
        if (queryDto.status) qb.andWhere({ status: ILike(`%${queryDto.status ?? ''}%`) })
        if (queryDto.donationType) qb.andWhere({ donationType: ILike(`%${queryDto.donationType ?? ''}%`) })
      }))
      .leftJoinAndSelect('donation.organization', 'organization')
      .leftJoinAndSelect('donation.donation_event', 'donation_event')

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const foundDonation = await this.donationRepo.findOne({
      where: { id },
      relations: {
        donation_event: true,
        organization: true,
        donor: true,
        labReport: {
          testResults: {
            testCase: true
          }
        },
      }
    });
    if (!foundDonation) throw new BadRequestException('Donation not found');

    return foundDonation;
  }

  async update(id: string, updateDonationDto: UpdateDonationDto) {
    const foundDonation = await this.findOne(id);

    // retrieving dependent entities
    const dependentColumns = await this.retrieveDependencies(updateDonationDto);

    // update donation
    Object.assign(foundDonation, {
      ...updateDonationDto,
      ...dependentColumns,
    })

    return await this.donationRepo.save(foundDonation);
  }

  async remove(ids: string[]) {
    const existingDonations = await this.donationRepo.find({
      where: {
        id: In(ids)
      }
    })
    await this.donationRepo.softRemove(existingDonations);

    return {
      success: true,
      message: 'Donations deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingDonations = await this.donationRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingDonations) throw new BadRequestException('Donation not found');

    return await this.donationRepo.restore(ids);
  }

  async clearTrash() {
    return await this.donationRepo.delete({
      deletedAt: Not(IsNull())
    })
  }

  async verifyDonation(id: string, verifiedBy: string) {
    const foundDonation = await this.findOne(id);

    foundDonation.verifiedBy = verifiedBy;

    return await this.donationRepo.save(foundDonation);
  }

  async rejectDonation(id: string, failedReason: string[]) {
    const foundDonation = await this.findOne(id);
    foundDonation.failedReason = failedReason;
    return await this.donationRepo.save(foundDonation);
  }

  private async retrieveDependencies(donationDto: CreateDonationDto | UpdateDonationDto) {
    const donor = await this.donorsService.findDonorWithDonations(donationDto.donor);
    const organization = await this.organizationsService.findOne(donationDto.organization);
    const donationEvent = await this.donationEventsService.findOne(donationDto.donation_event);

    return { donor, organization, donation_event: donationEvent };
  }

  private checkIfEligibleDonor(donor: Donor) {
    const now = new Date();
    const lastDonation = donor.donations[donor.donations.length - 1];
    if (lastDonation) {
      const lastDonationDate = new Date(lastDonation.createdAt);
      const diffInDays = Math.ceil(Math.abs(now.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffInDays < 90) {
        throw new BadRequestException('Donor must wait at least 90 days between donations');
      }
    }
  }
}
