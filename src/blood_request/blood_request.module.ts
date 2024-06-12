import { Module } from '@nestjs/common';
import { BloodRequestService } from './blood_request.service';
import { BloodRequestController } from './blood_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ServiceChargeModule } from 'src/service-charge/service-charge.module';
import { BloodRequestCharge } from './entities/blood-request-charge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodRequest,
      BloodRequestCharge,
    ]),
    InventoryModule,
    ServiceChargeModule,
  ],
  controllers: [BloodRequestController],
  providers: [BloodRequestService],
})
export class BloodRequestModule { }
