import { Module } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { DonorsController } from './donors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Donor
    ])
  ],
  controllers: [DonorsController],
  providers: [DonorsService],
})
export class DonorsModule { }
