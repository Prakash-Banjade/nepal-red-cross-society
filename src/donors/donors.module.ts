import { Module } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { DonorsController } from './donors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';
import { Address } from 'src/address/entities/address.entity';
import { AddressModule } from 'src/address/address.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donor]),
    AddressModule,
    UsersModule,
  ],
  controllers: [DonorsController],
  providers: [DonorsService],
  exports: [
    {
      useClass: DonorsService,
      provide: DonorsService
    }
  ]
})
export class DonorsModule { }
