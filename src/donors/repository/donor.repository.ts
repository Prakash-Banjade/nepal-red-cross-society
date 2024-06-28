import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/core/repository/base.repository';
import { DataSource } from 'typeorm';
import { Donor } from '../entities/donor.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class DonorRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async saveDonor(donor: Donor) {
        return await this.getRepository<Donor>(Donor).save(donor);
    }

    async saveUser(user: User) {
        return await this.getRepository<User>(User).save(user);
    }
}