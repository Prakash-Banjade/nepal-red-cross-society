import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { BloodInventory } from '../entities/blood_inventory.entity';

@Injectable({ scope: Scope.REQUEST })
export class BloodInventoryRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveBloodInventory(bloodInventory: BloodInventory) {
        return await this.getRepository<BloodInventory>(BloodInventory).save(bloodInventory);
    }
}