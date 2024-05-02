import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { Donation } from './entities/donation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule {}
