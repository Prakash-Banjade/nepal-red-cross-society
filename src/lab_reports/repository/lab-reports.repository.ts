import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { LabReport } from '../entities/lab_report.entity';
import { TestResult } from 'src/test_cases/entities/test_result.entity';
import { Donation } from 'src/donations/entities/donation.entity';
import { BloodInventory } from 'src/inventory/entities/blood_inventory.entity';

@Injectable({ scope: Scope.REQUEST })
export class LabReportRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveReport(labReport: LabReport) {
        return await this.getRepository<LabReport>(LabReport).save(labReport);
    }

    async saveTestResult(testResult: TestResult) {
        return await this.getRepository<TestResult>(TestResult).save(testResult);
    }

    async saveDonation(donation: Donation) {
        return await this.getRepository<Donation>(Donation).save(donation);
    }

    async saveBloodInventory(bloodInventory: BloodInventory) {
        return await this.getRepository<BloodInventory>(BloodInventory).save(bloodInventory);
    }
}