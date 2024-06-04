import { Module } from '@nestjs/common';
import { BloodRequestService } from './blood_request.service';
import { BloodRequestController } from './blood_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodRequest,
    ]),
    InventoryModule,
  ],
  controllers: [BloodRequestController],
  providers: [BloodRequestService],
})
export class BloodRequestModule { }
