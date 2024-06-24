import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodType, DonationType, Gender, RhFactor } from 'src/core/types/fieldsEnum.types';
import { Donation } from 'src/donations/entities/donation.entity';
import { Brackets, Repository } from 'typeorm';
import { MunicipalReportQueryDto, ReportQueryDto } from './dto/report-query.dto';
import { BloodRequest } from 'src/blood_request/entities/blood_request.entity';
import { Municipal } from 'src/core/types/municipals.types';
import { LabReport } from 'src/lab_reports/entities/lab_report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Donation) private readonly donationRepo: Repository<Donation>,
    @InjectRepository(BloodRequest) private readonly bloodRequestRepo: Repository<BloodRequest>,
    @InjectRepository(LabReport) private readonly labReportRepo: Repository<LabReport>,
  ) { }

  async byOrganization({ startDate, endDate }: ReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const qb = this.donationRepo.createQueryBuilder('donation')
      .leftJoin('donation.donor', 'donor')
      .leftJoin('donation.organization', 'organization')
      .leftJoin('organization.address', 'address')
      .where('donation.donationType = :type', { type: DonationType.ORGANIZATION }) // Filter out donations without an organization
      .andWhere('donor.gender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] })
      .andWhere('donation.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate }) // FILTER BY DATE

    // if (period === 'monthly' && month) {
    //   qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) = :month', { year, month });
    // } else if (period === ReportPeriod.YEARLY) {
    //   qb.andWhere('YEAR(donation.createdAt) = :year', { year });
    // } else if (period === ReportPeriod.QUARTERLY && quarter) {
    //   const startMonth = (quarter - 1) * 3 + 1;
    //   const endMonth = startMonth + 2;
    //   qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) BETWEEN :startMonth AND :endMonth',
    //     { year, startMonth, endMonth });
    // }

    qb.select([
      'organization.name AS organizationName',
      'CONCAT(address.municipality, "-", address.ward, ", ", address.district) AS organizationAddress',
      'SUM(CASE WHEN donor.gender = :male THEN 1 ELSE 0 END) AS maleCount',
      'SUM(CASE WHEN donor.gender = :female THEN 1 ELSE 0 END) AS femaleCount',
      'COUNT(donation.id) AS totalCount'
    ])
      .addGroupBy('organization.name')
      .addGroupBy('address.municipality')
      .addGroupBy('address.ward')
      .addGroupBy('address.district')
      .setParameters({ male: Gender.MALE, female: Gender.FEMALE });

    const results = await qb.getRawMany();

    // Calculate grand totals
    const grandTotalMales = results.reduce((sum, row) => sum + parseInt(row.maleCount), 0);
    const grandTotalFemales = results.reduce((sum, row) => sum + parseInt(row.femaleCount), 0);
    const grandTotal = results.reduce((sum, row) => sum + parseInt(row.totalCount), 0);

    return {
      report: results.map(row => ({
        organization: row.organizationName || 'Unknown',
        address: row.organizationAddress || 'Unknown',
        maleCount: parseInt(row.maleCount),
        femaleCount: parseInt(row.femaleCount),
        total: parseInt(row.totalCount),
      })),
      grandTotalMales,
      grandTotalFemales,
      grandTotal,
    };
  }

  async byHospital({ startDate, endDate }: ReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.hospital', 'hospital')
      .leftJoin('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .select('hospital.name', 'hospitalName')
      .addSelect('SUM(CASE WHEN requestedBloodBags.centrifuged = false THEN 1 ELSE 0 END)', 'nonCentrifugedCount')
      .addSelect('SUM(CASE WHEN requestedBloodBags.centrifuged = true THEN 1 ELSE 0 END)', 'centrifugedCount')
      .addSelect('COUNT(requestedBloodBags.id)', 'total')
      .where('bloodRequest.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate }) // FILTER BY DATE
      .groupBy('hospital.name');

    // if (period === 'monthly' && month) {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    // } else if (period === ReportPeriod.YEARLY) {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    // } else if (period === ReportPeriod.QUARTERLY && quarter) {
    //   const startMonth = (quarter - 1) * 3 + 1;
    //   const endMonth = startMonth + 2;
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
    //     { year, startMonth, endMonth });
    // }

    const result = await qb.getRawMany();

    // Calculate grand totals
    const grandTotalNonCentrifuged = result.reduce((sum, row) => sum + parseInt(row.nonCentrifugedCount), 0);
    const grandTotalCentrifuged = result.reduce((sum, row) => sum + parseInt(row.centrifugedCount), 0);
    const grandTotalTotal = result.reduce((sum, row) => sum + parseInt(row.total), 0);

    return {
      report: result.map(row => ({
        hospital: row.hospitalName,
        nonCentrifugedCount: parseInt(row.nonCentrifugedCount),
        centrifugedCount: parseInt(row.centrifugedCount),
        total: parseInt(row.total),
      })),
      grandTotalNonCentrifuged,
      grandTotalCentrifuged,
      grandTotalTotal,
    };
  }

  async byDonationByBloodGroup({ startDate, endDate }: ReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)); // ENSURE END DATE IS INCLUSIVE ( CONTANT OF THE ENTIRE DAY )

    const qb = this.donationRepo.createQueryBuilder('donation')
      .leftJoin('donation.donor', 'donor')
      .leftJoin('donation.organization', 'organization')
      .leftJoin('organization.address', 'address')
      // .where('donation.donationType = :type', { type: DonationType.ORGANIZATION }) // Filter out donations without an organization
      .where('donor.gender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] })
      .andWhere('donation.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate }) // FILTER BY DATE

    // if (period === 'monthly' && month) {
    //   qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) = :month', { year, month });
    // } else if (period === ReportPeriod.YEARLY) {
    //   qb.andWhere('YEAR(donation.createdAt) = :year', { year });
    // } else if (period === ReportPeriod.QUARTERLY && quarter) {
    //   const startMonth = (quarter - 1) * 3 + 1;
    //   const endMonth = startMonth + 2;
    //   qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) BETWEEN :startMonth AND :endMonth',
    //     { year, startMonth, endMonth });
    // }

    qb.select([
      'CASE WHEN donor.rhFactor = :positive THEN "positive" ELSE "Negative" END AS rhFactorGroup',
      'donor.bloodType AS bloodType',
      'SUM(CASE WHEN donor.gender = :male THEN 1 ELSE 0 END) AS maleCount',
      'SUM(CASE WHEN donor.gender = :female THEN 1 ELSE 0 END) AS femaleCount',
      'COUNT(donation.id) AS totalCount'
    ])
      .addGroupBy('rhFactorGroup')
      .addGroupBy('donor.bloodType')
      .setParameters({ positive: RhFactor.POSITIVE, male: Gender.MALE, female: Gender.FEMALE });

    const results = await qb.getRawMany();

    // Prepare the report format
    const report = {};

    results.forEach(row => {
      const rhFactorGroup = row.rhFactorGroup;
      const bloodType = row.bloodType;

      if (!report[rhFactorGroup]) {
        report[rhFactorGroup] = {};
      }

      report[rhFactorGroup][bloodType] = {
        maleCount: parseInt(row.maleCount),
        femaleCount: parseInt(row.femaleCount),
        total: parseInt(row.totalCount),
      };
    });

    // Calculate totals for each blood group
    const bloodGroups = Object.keys(BloodType).map(key => BloodType[key]);
    const grandTotal = {};

    bloodGroups.forEach(bloodType => {
      grandTotal[bloodType] = {
        maleCount: 0,
        femaleCount: 0,
        total: 0,
      };

      Object.values(report).forEach(rhFactorGroup => {
        if (rhFactorGroup[bloodType]) {
          grandTotal[bloodType].maleCount += rhFactorGroup[bloodType].maleCount;
          grandTotal[bloodType].femaleCount += rhFactorGroup[bloodType].femaleCount;
          grandTotal[bloodType].total += rhFactorGroup[bloodType].total;
        }
      });
    });

    return {
      report,
      grandTotal,
    };
  }

  // REPORT NO. 5
  async byBloodRequestByBloodGroup({ startDate, endDate }: ReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.patient', 'patient')
      .select([
        'bloodRequest.rhFactor AS rhFactorGroup',
        'bloodRequest.bloodType AS bloodType',
        'SUM(CASE WHEN patient.patientGender = :male THEN 1 ELSE 0 END) AS maleCount',
        'SUM(CASE WHEN patient.patientGender = :female THEN 1 ELSE 0 END) AS femaleCount',
        'COUNT(bloodRequest.id) AS totalCount'
      ])
      .where('patient.patientGender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] })
      .andWhere('bloodRequest.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate }) // FILTER BY DATE
      .groupBy('bloodRequest.rhFactor')
      .addGroupBy('bloodRequest.bloodType')
      .setParameters({ male: Gender.MALE, female: Gender.FEMALE });

    // if (period === 'monthly' && month) {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    // } else if (period === 'yearly') {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    // } else if (period === 'quarterly' && quarter) {
    //   const startMonth = (quarter - 1) * 3 + 1;
    //   const endMonth = startMonth + 2;
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
    //     { year, startMonth, endMonth });
    // }

    const results = await qb.getRawMany();

    const report = {
      positive: {},
      negative: {},
      grandTotalMalesPositive: 0,
      grandTotalFemalesPositive: 0,
      grandTotalMalesNegative: 0,
      grandTotalFemalesNegative: 0,
    };

    results.forEach(row => {
      const rhFactorGroup = row.rhFactorGroup;
      const bloodType = row.bloodType;

      if (!report[rhFactorGroup][bloodType]) {
        report[rhFactorGroup][bloodType] = {
          maleCount: 0,
          femaleCount: 0,
          total: 0,
        };
      }

      report[rhFactorGroup][bloodType].maleCount += parseInt(row.maleCount);
      report[rhFactorGroup][bloodType].femaleCount += parseInt(row.femaleCount);
      report[rhFactorGroup][bloodType].total += parseInt(row.totalCount);

      if (rhFactorGroup === RhFactor.POSITIVE) {
        report.grandTotalMalesPositive += parseInt(row.maleCount);
        report.grandTotalFemalesPositive += parseInt(row.femaleCount);
      } else {
        report.grandTotalMalesNegative += parseInt(row.maleCount);
        report.grandTotalFemalesNegative += parseInt(row.femaleCount);
      }
    });

    return report;
  }

  // REPORT NO. 6
  async byBloodRequestByBloodGroupCentrifuged({ startDate, endDate }: ReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.patient', 'patient')
      .leftJoin('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .select([
        'bloodRequest.rhFactor AS rhFactorGroup',
        'bloodRequest.bloodType AS bloodType',
        'SUM(CASE WHEN patient.patientGender = :male THEN 1 ELSE 0 END) AS maleCount',
        'SUM(CASE WHEN patient.patientGender = :female THEN 1 ELSE 0 END) AS femaleCount',
        'COUNT(bloodRequest.id) AS totalCount'
      ])
      .where('requestedBloodBags.centrifuged = true')
      .andWhere('patient.patientGender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] })
      .andWhere('bloodRequest.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate }) // FILTER BY DATE
      .groupBy('bloodRequest.rhFactor')
      .addGroupBy('bloodRequest.bloodType')
      .setParameters({ male: Gender.MALE, female: Gender.FEMALE });

    // if (period === 'monthly' && month) {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    // } else if (period === ReportPeriod.YEARLY) {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    // } else if (period === ReportPeriod.QUARTERLY && quarter) {
    //   const startMonth = (quarter - 1) * 3 + 1;
    //   const endMonth = startMonth + 2;
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
    //     { year, startMonth, endMonth });
    // }

    // Fetching the requestedComponents separately
    const componentsQb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .select('bloodRequest.requestedComponents')
      .where('requestedBloodBags.centrifuged = true')
      .andWhere('bloodRequest.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate }) // FILTER BY DATE

    const results = await qb.getRawMany();
    const componentResults = await componentsQb.getRawMany();

    // Prepare the report format
    const report = {
      positive: {},
      negative: {},
      componentCounts: {},
      grandTotalMalesPositive: 0,
      grandTotalFemalesPositive: 0,
      grandTotalMalesNegative: 0,
      grandTotalFemalesNegative: 0,
      grandTotalComponents: 0,
    };

    results.forEach(row => {
      const rhFactorGroup = row.rhFactorGroup;
      const bloodType = row.bloodType;

      if (!report[rhFactorGroup]) {
        report[rhFactorGroup] = {};
      }

      if (!report[rhFactorGroup][bloodType]) {
        report[rhFactorGroup][bloodType] = {
          maleCount: 0,
          femaleCount: 0,
          total: 0,
        };
      }

      report[rhFactorGroup][bloodType].maleCount += parseInt(row.maleCount);
      report[rhFactorGroup][bloodType].femaleCount += parseInt(row.femaleCount);
      report[rhFactorGroup][bloodType].total += parseInt(row.totalCount);

      if (rhFactorGroup === RhFactor.POSITIVE) {
        report.grandTotalMalesPositive += parseInt(row.maleCount);
        report.grandTotalFemalesPositive += parseInt(row.femaleCount);
      } else {
        report.grandTotalMalesNegative += parseInt(row.maleCount);
        report.grandTotalFemalesNegative += parseInt(row.femaleCount);
      }
    });

    // Count requested components
    componentResults.forEach(row => {
      console.log(row)
      const components = row.bloodRequest_requestedComponents?.split(',');
      components?.forEach(component => {
        if (!report.componentCounts[component]) {
          report.componentCounts[component] = 0;
        }
        report.componentCounts[component] += 1;
        report.grandTotalComponents += 1;
      });
    });

    return report;
  }

  async byMunicipalButwal({ startDate, endDate, municipal }: MunicipalReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .orderBy("bloodRequest.createdAt", "ASC")
      .leftJoin('bloodRequest.patient', 'patient')
      .leftJoin('bloodRequest.hospital', 'hospital')
      .leftJoin('hospital.address', 'address')
      .where(new Brackets(qb => {
        qb.andWhere('address.municipality = :municipality', { municipality: municipal });
      }))
      .andWhere('bloodRequest.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate })
      .select([
        'hospital.name',
        'bloodRequest.createdAt',
        'bloodRequest.xmNo',
        'patient.patientGender',
        'patient.patientName',
        'patient.contact',
        'patient.patientAge',
        'patient.issuedFrom',
        'patient.issueDate',
        'patient.citizenshipNo',
        'address.municipality',
        'address.ward',
        'bloodRequest.permanentPaper',
        'bloodRequest.bloodType',
        'bloodRequest.rhFactor',
        'bloodRequest.totalAmount',
        'bloodRequest.requestedComponents',
        'bloodRequest.disease',
      ])


    // if (period === 'monthly' && month) {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    // } else if (period === ReportPeriod.YEARLY) {
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    // } else if (period === ReportPeriod.QUARTERLY && quarter) {
    //   const startMonth = (quarter - 1) * 3 + 1;
    //   const endMonth = startMonth + 2;
    //   qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
    //     { year, startMonth, endMonth });
    // }

    const result = await qb.getMany();

    const refinedResult = result.flatMap(row => {
      return row.requestedComponents.map(component => {
        return {
          ...row,
          requestedComponents: component
        }
      })
    })

    return { report: refinedResult };
  }

  async byPatient({ startDate, endDate }: ReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));
    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.patient', 'patient')
      .leftJoin('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .select([
        'bloodRequest.xmNo AS xmNo',
        'bloodRequest.createdAt AS createdAt',
        'patient.patientName AS patientName',
        'patient.patientAge AS age',
        'patient.patientGender AS gender',
        'CONCAT(bloodRequest.bloodType, " ", CASE WHEN bloodRequest.rhFactor = "positive" THEN "+ve" ELSE "-ve" END) AS bloodGroup',
        'COUNT(requestedBloodBags.id) AS requestedBloodBagsCount',
        'bloodRequest.totalAmount AS totalAmount',
        '(COUNT(requestedBloodBags.id) * bloodRequest.totalAmount) AS grandTotalAmount'
      ])
      .where('bloodRequest.createdAt BETWEEN :startDate AND :adjustedEndDate', { startDate, adjustedEndDate })
      .groupBy('bloodRequest.xmNo')
      .addGroupBy('bloodRequest.createdAt')
      .addGroupBy('patient.patientName')
      .addGroupBy('patient.patientAge')
      .addGroupBy('patient.patientGender')
      .addGroupBy('bloodRequest.bloodType')
      .addGroupBy('bloodRequest.rhFactor')
      .addGroupBy('bloodRequest.totalAmount');

    const results = await qb.getRawMany();

    return results.map(row => ({
      xmNo: row.xmNo,
      createdAt: row.createdAt,
      patientName: row.patientName,
      age: row.age,
      gender: row.gender,
      bloodGroup: row.bloodGroup,
      quantity: parseInt(row.requestedBloodBagsCount),
      rate: parseInt(row.totalAmount),
      total: parseInt(row.grandTotalAmount)
    }));
  }

  async byCentrifugedComponents({ startDate, endDate }: ReportQueryDto) {
    const adjustedEndDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    const rawQuery = `
      SELECT
        component,
        COUNT(component) AS componentCount
      FROM (
        SELECT
          subLabReport.id,
          SUBSTRING_INDEX(SUBSTRING_INDEX(subLabReport.separatedComponents, ',', numbers.n), ',', -1) AS component
        FROM lab_report subLabReport
        JOIN (
          SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
          UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
          UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
          UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
        ) numbers
        ON CHAR_LENGTH(subLabReport.separatedComponents) - CHAR_LENGTH(REPLACE(subLabReport.separatedComponents, ',', '')) + 1 >= numbers.n
        WHERE subLabReport.date BETWEEN ? AND ?
        AND subLabReport.separatedComponents IS NOT NULL
      ) components
      GROUP BY component
    `;

    const results = await this.labReportRepo.query(rawQuery, [startDate, adjustedEndDate]);

    // Calculate the total number of separated components
    const totalCount = results?.reduce((acc, row) => acc + parseInt(row.componentCount, 10), 0);

    return {
      components: results?.map(row => ({
        component: row.component,
        count: parseInt(row.componentCount, 10)
      })),
      totalCount
    };
  }
}



