import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Donation } from 'src/donations/entities/donation.entity';
import { DonationsModule } from 'src/donations/donations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    DonationsModule,
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule { }
