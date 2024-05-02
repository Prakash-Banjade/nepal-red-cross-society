import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Donation } from 'src/donations/entities/donation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certificate,
      Donation,
    ])
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule { }
