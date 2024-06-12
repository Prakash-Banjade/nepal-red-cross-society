import { Module } from '@nestjs/common';
import { ServiceChargeService } from './service-charge.service';
import { ServiceChargeController } from './service-charge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCharge } from './entities/service-charge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceCharge,
    ])
  ],
  controllers: [ServiceChargeController],
  providers: [ServiceChargeService],
  exports: [ServiceChargeService],
})
export class ServiceChargeModule {}
