import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLabReportDto } from './dto/create-lab_report.dto';
import { UpdateLabReportDto } from './dto/update-lab_report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LabReport } from './entities/lab_report.entity';
import { In, Repository } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import { TestCase } from 'src/test_cases/entities/test_case.entity';
import { CreateTestCaseDto } from 'src/test_cases/dto/create-test_case.dto';
import { TestResult } from 'src/test_cases/entities/test_result.entity';

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

    // evaluating testcases


    const testResults = await this.evaluateTestResults(createLabReportDto)

    labReport.testResults = testResults;

    return await this.labReportRepo.save(labReport);
  }

  async findAll() {
    return await this.labReportRepo.find();
  }

  async findOne(id: string) {
    const existingLabReport = await this.labReportRepo.findOneBy({ id });
    if (!existingLabReport) throw new BadRequestException('Lab report not found');

    return existingLabReport;
  }

  async update(id: string, updateLabReportDto: UpdateLabReportDto) {
    const existingLabReport = await this.findOne(id);

    // evaluating testCases
    const testCases = await this.testCaseRepo.findBy({ id: In(updateLabReportDto?.testCases) });

    // evaluating donation
    const existingDonation = await this.donationRepo.findOneBy({ id: updateLabReportDto?.donation });
    if (!existingDonation) throw new BadRequestException('Donation not found');

    Object.assign(existingLabReport, {
      ...updateLabReportDto,
      testCases,
      donation: existingDonation
    });

    return await this.labReportRepo.save(existingLabReport);
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

  async evaluateTestResults(createLabReportDto: CreateLabReportDto) {
    const testCaseIds = createLabReportDto?.testCases?.map(testCase => testCase.testCase)
    const testCases = await this.testCaseRepo.findBy({ id: In(testCaseIds) })

    // const testCaseWithResult = testCases.map((testCase, ind) => ({
    //   testCase,
    //   result: 
    // }))

    const queryBuilder = this.testResultRepo.createQueryBuilder("testResult")

    // there can be a bug here if all the provided testcase id are not valid
    queryBuilder
      .insert()
      .values([
        ...createLabReportDto.testCases.map((testcase, ind) => ({
          testcase: testCases[ind],
          result: testcase.obtainedResult
        }))
      ])

    const { entities } = await queryBuilder.getRawAndEntities()

    return entities
  }
}
