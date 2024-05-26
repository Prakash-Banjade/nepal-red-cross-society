import { Module } from '@nestjs/common';
import { BloodRequestService } from './blood_request.service';
import { BloodRequestController } from './blood_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodRequest,
    ])
  ],
  controllers: [BloodRequestController],
  providers: [BloodRequestService],
})
export class BloodRequestModule {}
