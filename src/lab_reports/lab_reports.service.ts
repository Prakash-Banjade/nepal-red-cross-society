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

@Injectable()
export class LabReportsService {
  constructor(
    @InjectRepository(LabReport) private labReportRepo: Repository<LabReport>,
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    @InjectRepository(TestCase) private testCaseRepo: Repository<TestCase>,
    @InjectRepository(TestResult) private testResultRepo: Repository<TestResult>,
  ) { }

  async create(createLabReportDto: CreateLabReportDto) {
    const donation = await this.donation(createLabReportDto.donation)

    const labReport = this.labReportRepo.create({
      date: createLabReportDto.date,
      issuedBy: createLabReportDto.issuedBy,
      donation: donation,
    })

    const savedLabReport = await this.labReportRepo.save(labReport);

    await this.evaluateTestResults(createLabReportDto, savedLabReport);

    return {
      success: true,
      message: 'Lab report created successfully',
    }
  }

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
    const existingDonation = await this.donationRepo.findOneBy({ id: updateLabReportDto?.donation });
    if (!existingDonation) throw new BadRequestException('Donation not found');

    Object.assign(existingLabReport, {
      ...updateLabReportDto,
      donation: existingDonation
    });

    const savedLabReport = await this.labReportRepo.save(existingLabReport);

    await this.evaluateTestResults_update(updateLabReportDto, savedLabReport.id);

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
    const existingDonation = await this.donationRepo.findOneBy({ id });
    if (!existingDonation) throw new BadRequestException('Donation not found');

    return existingDonation
  }

  async evaluateTestResults(createLabReportDto: CreateLabReportDto, labReport: LabReport) {
    const testCaseIds = createLabReportDto?.testCases?.map(testCase => testCase.testCase)
    const testCases = await this.testCaseRepo.findBy({ id: In(testCaseIds) })

    for (const testCase of testCases) {
      await this.testResultRepo.save({
        labReport,
        testCase,
        obtainedResult: createLabReportDto.testCases.find(t => t.testCase === testCase.id).obtainedResult,
        status: createLabReportDto.testCases.find(t => t.testCase === testCase.id).status

      })
    }
  }

  async evaluateTestResults_update(updateLabReportDto: UpdateLabReportDto, labReportId: string) {
    const labReport = await this.findOne(labReportId)
    const testResults = labReport.testResults;

    for (const testResult of testResults) {
      const foundTestResult = await this.testResultRepo.findOne({
        where: { id: testResult.id },
        relations: { testCase: true }
      });
      Object.assign(foundTestResult, {
        obtainedResult: updateLabReportDto.testCases.find(t => t.testCase === foundTestResult?.testCase?.id)?.obtainedResult,
        status: updateLabReportDto.testCases.find(t => t.testCase === foundTestResult?.testCase?.id)?.status,
      })
      await this.testResultRepo.save(foundTestResult);
    }
  }
}
