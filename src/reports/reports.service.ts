import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodType, DonationType, Gender, RhFactor } from 'src/core/types/fieldsEnum.types';
import { ReportPeriod } from 'src/core/types/global.types';
import { Donation } from 'src/donations/entities/donation.entity';
import { Brackets, Repository } from 'typeorm';
import { ReportQueryDto } from './dto/report-query.dto';
import { BloodRequest } from 'src/blood_request/entities/blood_request.entity';
import { Municipal } from 'src/core/types/municipals.types';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Donation) private readonly donationRepo: Repository<Donation>,
    @InjectRepository(BloodRequest) private readonly bloodRequestRepo: Repository<BloodRequest>,
  ) { }

  async byOrganization({ year, month, quarter, period }: ReportQueryDto) {
    const qb = this.donationRepo.createQueryBuilder('donation')
      .leftJoin('donation.donor', 'donor')
      .leftJoin('donation.organization', 'organization')
      .leftJoin('organization.address', 'address')
      .where('donation.donationType = :type', { type: DonationType.ORGANIZATION }) // Filter out donations without an organization
      .andWhere('donor.gender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] });

    if (period === 'monthly' && month) {
      qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) = :month', { year, month });
    } else if (period === ReportPeriod.YEARLY) {
      qb.andWhere('YEAR(donation.createdAt) = :year', { year });
    } else if (period === ReportPeriod.QUARTERLY && quarter) {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) BETWEEN :startMonth AND :endMonth',
        { year, startMonth, endMonth });
    }

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

  // async byHospital({ year, month, quarter, period }: ReportQueryDto) {
  //   const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
  //     .leftJoinAndSelect('bloodRequest.hospital', 'hospital')
  //     .leftJoinAndSelect('bloodRequest.requestedBloodBags', 'requestedBloodBags')
  //     .leftJoinAndSelect('requestedBloodBags.bloodBag', 'bloodBag');

  //   if (period === 'monthly' && month) {
  //     qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) = :month', { year, month });
  //   } else if (period === ReportPeriod.YEARLY) {
  //     qb.andWhere('YEAR(donation.createdAt) = :year', { year });
  //   } else if (period === ReportPeriod.QUARTERLY && quarter) {
  //     const startMonth = (quarter - 1) * 3 + 1;
  //     const endMonth = startMonth + 2;
  //     qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) BETWEEN :startMonth AND :endMonth',
  //       { year, startMonth, endMonth });
  //   }

  //   const bloodRequests = await qb.getMany();

  //   const report = bloodRequests.reduce((acc, bloodRequest) => {
  //     const hospitalName = bloodRequest.hospital.name;

  //     if (!acc[hospitalName]) {
  //       acc[hospitalName] = {
  //         hospital: hospitalName,
  //         nonCentrifugedCount: 0,
  //         centrifugedCount: 0,
  //         total: 0
  //       };
  //     }

  //     bloodRequest.requestedBloodBags.forEach(bag => {
  //       if (bag.centrifuged) {
  //         acc[hospitalName].centrifugedCount += 1;
  //       } else {
  //         acc[hospitalName].nonCentrifugedCount += 1;
  //       }
  //       acc[hospitalName].total += 1;
  //     });

  //     return acc;
  //   }, {});

  //   return Object.values(report);
  // }

  async byHospital({ year, month, quarter, period }: ReportQueryDto) {
    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.hospital', 'hospital')
      .leftJoin('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .select('hospital.name', 'hospitalName')
      .addSelect('SUM(CASE WHEN requestedBloodBags.centrifuged = false THEN 1 ELSE 0 END)', 'nonCentrifugedCount')
      .addSelect('SUM(CASE WHEN requestedBloodBags.centrifuged = true THEN 1 ELSE 0 END)', 'centrifugedCount')
      .addSelect('COUNT(requestedBloodBags.id)', 'total')
      .groupBy('hospital.name');

    if (period === 'monthly' && month) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    } else if (period === ReportPeriod.YEARLY) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    } else if (period === ReportPeriod.QUARTERLY && quarter) {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
        { year, startMonth, endMonth });
    }

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

  async byDonationByBloodGroup({ year, month, quarter, period }: ReportQueryDto) {
    const qb = this.donationRepo.createQueryBuilder('donation')
      .leftJoin('donation.donor', 'donor')
      .leftJoin('donation.organization', 'organization')
      .leftJoin('organization.address', 'address')
      // .where('donation.donationType = :type', { type: DonationType.ORGANIZATION }) // Filter out donations without an organization
      .where('donor.gender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] });

    if (period === 'monthly' && month) {
      qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) = :month', { year, month });
    } else if (period === ReportPeriod.YEARLY) {
      qb.andWhere('YEAR(donation.createdAt) = :year', { year });
    } else if (period === ReportPeriod.QUARTERLY && quarter) {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      qb.andWhere('YEAR(donation.createdAt) = :year AND MONTH(donation.createdAt) BETWEEN :startMonth AND :endMonth',
        { year, startMonth, endMonth });
    }

    qb.select([
      'CASE WHEN donor.rhFactor = :positive THEN "Positive" ELSE "Negative" END AS rhFactorGroup',
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

  async byBloodRequestByBloodGroup({ year, month, quarter, period }: ReportQueryDto) {
    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .leftJoin('requestedBloodBags.bloodBag', 'bloodBag')
      .select([
        'CASE WHEN bloodRequest.rhFactor = :positive THEN "Positive" ELSE "Negative" END AS rhFactorGroup',
        'bloodRequest.bloodType AS bloodType',
        'SUM(CASE WHEN bloodRequest.patientGender = :male THEN 1 ELSE 0 END) AS maleCount',
        'SUM(CASE WHEN bloodRequest.patientGender = :female THEN 1 ELSE 0 END) AS femaleCount',
        'COUNT(bloodRequest.id) AS totalCount',
        'SUM(CASE WHEN requestedBloodBags.centrifuged = true THEN 1 ELSE 0 END) AS centrifugedCount',
        'SUM(CASE WHEN requestedBloodBags.centrifuged = false THEN 1 ELSE 0 END) AS nonCentrifugedCount',
      ])
      .where('bloodRequest.patientGender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] })
      .andWhere('bloodRequest.bloodType IN (:...bloodTypes)', { bloodTypes: Object.values(BloodType) })
      .addGroupBy('rhFactorGroup')
      .addGroupBy('bloodRequest.bloodType')
      .addGroupBy('requestedBloodBags.centrifuged')
      .setParameters({ positive: RhFactor.POSITIVE, male: Gender.MALE, female: Gender.FEMALE });

    if (period === 'monthly' && month) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    } else if (period === ReportPeriod.YEARLY) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    } else if (period === ReportPeriod.QUARTERLY && quarter) {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
        { year, startMonth, endMonth });
    }

    try {
      const results = await qb.getRawMany();

      // Prepare the report format
      const report = {};

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
            centrifugedCount: 0,
            nonCentrifugedCount: 0,
          };
        }

        report[rhFactorGroup][bloodType].maleCount += parseInt(row.maleCount);
        report[rhFactorGroup][bloodType].femaleCount += parseInt(row.femaleCount);
        report[rhFactorGroup][bloodType].total += parseInt(row.totalCount);
        report[rhFactorGroup][bloodType].centrifugedCount += parseInt(row.centrifugedCount);
        report[rhFactorGroup][bloodType].nonCentrifugedCount += parseInt(row.nonCentrifugedCount);
      });

      return {
        report,
      };
    } catch (error) {
      console.error('Error fetching blood request report:', error);
      throw error; // Throw the error to handle it appropriately
    }
  }

  async byPositiveRhFactorCentrifuged({ year, month, quarter, period }: ReportQueryDto) {
    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .leftJoin('bloodRequest.requestedBloodBags', 'requestedBloodBags')
      .leftJoin('requestedBloodBags.bloodBag', 'bloodBag')
      .leftJoin('bloodBag.donation', 'donation')
      .leftJoin('donation.donor', 'donor')
      .where('donor.rhFactor = :rhFactor', { rhFactor: RhFactor.POSITIVE })
      .andWhere('requestedBloodBags.centrifuged = true')
      .andWhere('donor.gender IN (:...genders)', { genders: [Gender.MALE, Gender.FEMALE] })
      .select([
        'donor.bloodType AS bloodType',
        'SUM(CASE WHEN donor.gender = :male THEN 1 ELSE 0 END) AS maleCount',
        'SUM(CASE WHEN donor.gender = :female THEN 1 ELSE 0 END) AS femaleCount',
        'COUNT(bloodRequest.id) AS totalCount',
      ])
      .addGroupBy('donor.bloodType')
      .setParameters({ male: Gender.MALE, female: Gender.FEMALE });

    if (period === 'monthly' && month) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    } else if (period === ReportPeriod.YEARLY) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    } else if (period === ReportPeriod.QUARTERLY && quarter) {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
        { year, startMonth, endMonth });
    }

    try {
      const results = await qb.getRawMany();

      return {
        report: results.map(row => ({
          bloodType: row.bloodType,
          maleCount: parseInt(row.maleCount),
          femaleCount: parseInt(row.femaleCount),
          total: parseInt(row.totalCount),
        })),
      };
    } catch (error) {
      console.error('Error fetching blood request report:', error);
      throw error; // Throw the error to handle it appropriately
    }
  }

  async byMunicipalButwal({ year, month, quarter, period }: ReportQueryDto, municipal: Municipal) {
    const qb = this.bloodRequestRepo.createQueryBuilder('bloodRequest')
      .orderBy("bloodRequest.createdAt", "ASC")
      .leftJoin('bloodRequest.patient', 'patient')
      .leftJoin('bloodRequest.hospital', 'hospital')
      .leftJoin('hospital.address', 'address')
      .where(new Brackets(qb => {
        qb.andWhere('address.municipality = :municipality', { municipality: municipal });
      }))
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


    if (period === 'monthly' && month) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) = :month', { year, month });
    } else if (period === ReportPeriod.YEARLY) {
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year', { year });
    } else if (period === ReportPeriod.QUARTERLY && quarter) {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      qb.andWhere('YEAR(bloodRequest.createdAt) = :year AND MONTH(bloodRequest.createdAt) BETWEEN :startMonth AND :endMonth',
        { year, startMonth, endMonth });
    }

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
}



