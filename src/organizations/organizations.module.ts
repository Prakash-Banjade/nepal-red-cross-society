import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Donation } from 'src/donations/entities/donation.entity';
import { Address } from 'src/address/entities/address.entity';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Donation,
      Address,
    ]),
    AddressModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule { }
