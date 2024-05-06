import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLabReportDto } from './dto/create-lab_report.dto';
import { UpdateLabReportDto } from './dto/update-lab_report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LabReport } from './entities/lab_report.entity';
import { In, Repository } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import { TestCase } from 'src/test_cases/entities/test_case.entity';

@Injectable()
export class LabReportsService {
  constructor(
    @InjectRepository(LabReport) private labReportRepo: Repository<LabReport>,
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    @InjectRepository(TestCase) private testCaseRepo: Repository<TestCase>,
  ) { }

  async create(createLabReportDto: CreateLabReportDto) {
    const existingDonation = await this.donationRepo.findOneBy({ id: createLabReportDto.donation });
    if (!existingDonation) throw new BadRequestException('Donation not found');

    // evaluating testcases
    const testCases = await this.testCaseRepo.findBy({ id: In(createLabReportDto?.testCases) });

    const labReport = this.labReportRepo.create({
      ...createLabReportDto,
      donation: existingDonation,
      testCases,
    });
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

  async remove(id: string) {
    const existingLabReport = await this.findOne(id);
    return await this.labReportRepo.softRemove(existingLabReport);
  }
}
