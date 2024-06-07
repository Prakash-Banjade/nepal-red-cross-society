import { Module } from '@nestjs/common';
import { BloodBagsService } from './blood-bags.service';
import { BloodBagsController } from './blood-bags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodBag } from './entities/blood-bag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodBag,
    ])
  ],
  controllers: [BloodBagsController],
  providers: [BloodBagsService],
  exports: [BloodBagsService]
})
export class BloodBagsModule { }
