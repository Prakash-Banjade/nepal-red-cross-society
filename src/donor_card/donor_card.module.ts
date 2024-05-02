import { Module } from '@nestjs/common';
import { DonorCardService } from './donor_card.service';
import { DonorCardController } from './donor_card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorCard } from './entities/donor_card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonorCard
    ])
  ],
  controllers: [DonorCardController],
  providers: [DonorCardService],
})
export class DonorCardModule { }
