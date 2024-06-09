import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLabReportDto } from './dto/create-lab_report.dto';
import { UpdateLabReportDto } from './dto/update-lab_report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LabReport } from './entities/lab_report.entity';
import { In, IsNull, Not, Or, Repository } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import { TestCase } from 'src/test_cases/entities/test_case.entity';
import { TestResult } from 'src/test_cases/entities/test_result.entity';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { DonationStatus, TestCaseStatus } from 'src/core/types/fieldsEnum.types';
import { InventoryItem } from 'src/inventory/entities/inventory-item.entity';
import { DonorsService } from 'src/donors/donors.service';
import { UpdateDonorDto } from 'src/donors/dto/update-donor.dto';
import { BloodInventory } from 'src/inventory/entities/blood_inventory.entity';

@Injectable()
export class LabReportsService {
  constructor(
    @InjectRepository(LabReport) private labReportRepo: Repository<LabReport>,
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    @InjectRepository(TestCase) private testCaseRepo: Repository<TestCase>,
    @InjectRepository(TestResult) private testResultRepo: Repository<TestResult>,
    @InjectRepository(InventoryItem) private readonly inventoryItemRepo: Repository<InventoryItem>,
    @InjectRepository(BloodInventory) private readonly bloodInventoryRepo: Repository<BloodInventory>,
    private readonly donorService: DonorsService
  ) { }

  async create(createLabReportDto: CreateLabReportDto) {
    const donation = await this.donation(createLabReportDto.donation)

    const labReport = this.labReportRepo.create({
      date: createLabReportDto.date,
      issuedBy: createLabReportDto.issuedBy,
      donation: donation,
    })

    const savedLabReport = await this.labReportRepo.save(labReport);

    const isSucceed = await this.evaluateTestResults(createLabReportDto, savedLabReport); // also save test results

    // change donation status and verifiedBy
    donation.status = isSucceed ? DonationStatus.SUCCESS : DonationStatus.FAILED;
    donation.verifiedBy = createLabReportDto.issuedBy

    await this.donationRepo.save(donation);

    // update blood inventory item with corresponding blood bag no
    // await this.updateBloodInventory(donation, isSucceed, createLabReportDto);

    // update blood type of donor which has been found after testing, the initial blood type while creating donor may be incorrect
    await this.donorService.update(donation.donor.id, {
      bloodType: createLabReportDto.bloodType,
      rhFactor: createLabReportDto.rhFactor,
    } as UpdateDonorDto)

    return {
      success: true,
      message: 'Lab report created successfully',
    }
  }

  // async updateBloodInventory(donation: Donation, isSucceed: boolean, labReportDto: CreateLabReportDto | UpdateLabReportDto) {
  //   const inventoryItem = await this.inventoryItemRepo.findOne({
  //     where: { bloodBagNo: donation.bloodBagNo },
  //     relations: { inventory: true }
  //   });
  //   if (!inventoryItem) return;

  //   inventoryItem.status = isSucceed ? BloodInventoryStatus.USABLE : BloodInventoryStatus.WASTE; // update inventory blood item status
  //   await this.inventoryItemRepo.save(inventoryItem);

  //   if (labReportDto.bloodType && labReportDto.rhFactor) { // update blood inventory, inventory created at first donation can have incorrect blood type which may be fixed after lab report generation
  //     const inventory = await this.bloodInventoryRepo.findOneBy({ id: inventoryItem.inventory.id });

  //     inventory.bloodType = labReportDto.bloodType; // update inventory blood type
  //     inventory.rhFactor = labReportDto.rhFactor; // update inventory rh factor
  //     await this.bloodInventoryRepo.save(inventory);
  //   }

  // }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.labReportRepo.createQueryBuilder('labReport');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("labReport.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.page)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })

    return paginatedData(queryDto, queryBuilder);

  }

  async findOne(id: string) {
    const existingLabReport = await this.labReportRepo.findOne({
      where: { id },
      relations: { testResults: { testCase: true } }
    });
    if (!existingLabReport) throw new BadRequestException('Lab report not found');

    return existingLabReport;
  }

  async update(id: string, updateLabReportDto: UpdateLabReportDto) {
    const existingLabReport = await this.findOne(id);
    // evaluating donation
    const existingDonation = await this.donation(updateLabReportDto.donation);
    if (!existingDonation) throw new BadRequestException('Donation not found');

    Object.assign(existingLabReport, {
      ...updateLabReportDto,
      donation: existingDonation
    });

    const savedLabReport = await this.labReportRepo.save(existingLabReport);

    const isSucceed = await this.evaluateTestResults_update(updateLabReportDto, savedLabReport.id);

    existingDonation.status = isSucceed ? DonationStatus.SUCCESS : DonationStatus.FAILED;

    existingDonation.verifiedBy = updateLabReportDto?.issuedBy || existingDonation.verifiedBy

    await this.donationRepo.save(existingDonation);

    // update blood inventory item with corresponding blood bag no
    // await this.updateBloodInventory(existingDonation, isSucceed, updateLabReportDto);

    // update blood type of donor which has been found after testing, the initial blood type while creating donor may be incorrect
    await this.donorService.update(existingDonation.donor.id, {
      bloodType: updateLabReportDto.bloodType,
      rhFactor: updateLabReportDto.rhFactor,
    } as UpdateDonorDto)

    return {
      success: true,
      message: 'Lab report updated successfully',
    }
  }

  async remove(ids: string[]) {
    const existingLabReports = await this.labReportRepo.find({
      where: {
        id: In(ids)
      }
    })
    await this.labReportRepo.softRemove(existingLabReports);

    return {
      success: true,
      message: 'Lab reports deleted successfully',
    }
  }

  async donation(id: string) {
    const existingDonation = await this.donationRepo.findOne({
      where: { id },
      relations: { donor: true }
    });
    if (!existingDonation) throw new BadRequestException('Donation not found');

    return existingDonation
  }

  async evaluateTestResults(createLabReportDto: CreateLabReportDto, labReport: LabReport) {
    const testCaseIds = createLabReportDto?.testCases?.map(testCase => testCase.testCase)
    const testCases = await this.testCaseRepo.findBy({ id: In(testCaseIds) })

    let statusArr: boolean[] = []

    for (const testCase of testCases) {
      const obtainedResult = createLabReportDto.testCases.find(t => t.testCase === testCase.id).obtainedResult;
      const status = createLabReportDto.testCases.find(t => t.testCase === testCase.id).status

      await this.testResultRepo.save({
        labReport,
        testCase,
        obtainedResult,
        status,
      })

      statusArr.push(status === TestCaseStatus.PASS);
    }

    return statusArr.every(status => !!status);

  }

  async evaluateTestResults_update(updateLabReportDto: UpdateLabReportDto, labReportId: string) {
    const labReport = await this.findOne(labReportId)
    const testResults = labReport.testResults;

    let statusArr: boolean[] = []

    for (const testResult of testResults) {
      const foundTestResult = await this.testResultRepo.findOne({
        where: { id: testResult.id },
        relations: { testCase: true }
      });
      const obtainedResult = updateLabReportDto.testCases.find(t => t.testCase === foundTestResult?.testCase?.id)?.obtainedResult
      const status = updateLabReportDto.testCases.find(t => t.testCase === foundTestResult?.testCase?.id)?.status

      Object.assign(foundTestResult, {
        obtainedResult,
        status,
      })
      await this.testResultRepo.save(foundTestResult);

      statusArr.push(status === TestCaseStatus.PASS);
    }

    return statusArr.every(status => !!status);
  }
}
