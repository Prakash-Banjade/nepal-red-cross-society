import { Module } from '@nestjs/common';
import { BloodRequestService } from './blood_request.service';
import { BloodRequestController } from './blood_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ServiceChargeModule } from 'src/service-charge/service-charge.module';
import { BloodRequestCharge } from './entities/blood-request-charge.entity';
import { RequestedBloodBag } from './entities/requestedBloodBag.entity';
import { HospitalsModule } from 'src/hospitals/hospitals.module';
import { BloodRequestsRepository } from './repository/blood_request.repository';
import { BloodRequestsChargeRepository } from './repository/blood_request_charge.repository';
import { RequestedBloodBagRepository } from './repository/requestedBloodBag.repository';
import { Patient } from './entities/patient.entity';
import { PatientController } from './patient.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodRequest,
      BloodRequestCharge,
      RequestedBloodBag,
      Patient
    ]),
    InventoryModule,
    ServiceChargeModule,
    HospitalsModule,
  ],
  controllers: [BloodRequestController, PatientController],
  providers: [BloodRequestService, BloodRequestsChargeRepository, BloodRequestsRepository, RequestedBloodBagRepository, PatientsService],
})
export class BloodRequestModule { }
