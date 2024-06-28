import { Module } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { DonorsController } from './donors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';
import { AddressModule } from 'src/address/address.module';
import { UsersModule } from 'src/users/users.module';
import { DonorRepository } from './repository/donor.repository';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donor, User]),
    AddressModule,
    UsersModule,
  ],
  controllers: [DonorsController],
  providers: [DonorsService, DonorRepository],
  exports: [
    {
      useClass: DonorsService,
      provide: DonorsService
    }
  ]
})
export class DonorsModule { }
