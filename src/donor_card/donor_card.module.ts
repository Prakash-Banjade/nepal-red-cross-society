import { Module } from '@nestjs/common';
import { DonorCardService } from './donor_card.service';
import { DonorCardController } from './donor_card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorCard } from './entities/donor_card.entity';
import { Donor } from 'src/donors/entities/donor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonorCard,
      Donor
    ])
  ],
  controllers: [DonorCardController],
  providers: [DonorCardService],
})
export class DonorCardModule { }
