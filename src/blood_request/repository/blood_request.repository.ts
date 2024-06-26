import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { BloodRequest } from '../entities/blood_request.entity';
import { Patient } from '../entities/patient.entity';

@Injectable({ scope: Scope.REQUEST })
export class BloodRequestsRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveBloodRequest(bloodRequest: BloodRequest) {
        return await this.getRepository<BloodRequest>(BloodRequest).save(bloodRequest);
    }

    async savePatient(patient: Patient) {
        return await this.getRepository<Patient>(Patient).save(patient);
    }
}