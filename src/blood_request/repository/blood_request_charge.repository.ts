import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { BloodRequestCharge } from '../entities/blood-request-charge.entity';

@Injectable({ scope: Scope.REQUEST })
export class BloodRequestsChargeRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveCharge(charge: BloodRequestCharge) {
        return await this.getRepository<BloodRequestCharge>(BloodRequestCharge).save(charge);
    }
}