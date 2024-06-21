import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { RequestedBloodBag } from '../entities/requestedBloodBag.entity';

@Injectable({ scope: Scope.REQUEST })
export class RequestedBloodBagRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveRequestedBloodBag(requestedBloodBag: RequestedBloodBag) {
        return await this.getRepository<RequestedBloodBag>(RequestedBloodBag).save(requestedBloodBag);
    }
}