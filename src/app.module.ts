import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/db.config';
import { UsersModule } from './users/users.module';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AbilitiesGuard } from './casl/guards/abilities.guard';
import { DonorsModule } from './donors/donors.module';
import { DonationsModule } from './donations/donations.module';
import { DonationEventsModule } from './donation_events/donation_events.module';
import { CertificateModule } from './certificate/certificate.module';
import { TechniciansModule } from './technicians/technicians.module';
import { LabReportsModule } from './lab_reports/lab_reports.module';
import { TestCasesModule } from './test_cases/test_cases.module';
import { DonorCardModule } from './donor_card/donor_card.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AddressModule } from './address/address.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { BloodRequestModule } from './blood_request/blood_request.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    TypeOrmModule.forRoot(configService),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      isGlobal: true,
      fileSystemStoragePath: 'public',
      autoDeleteFile: false,
      cleanupAfterSuccessHandle: false, // !important
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // serve static files eg: localhost:3000/filename.png
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 10 requests per minute
      limit: 30,
    }]),
    UsersModule,
    AuthModule,
    CaslModule,
    DonorsModule,
    DonationsModule,
    DonationEventsModule,
    CertificateModule,
    TechniciansModule,
    LabReportsModule,
    TestCasesModule,
    DonorCardModule,
    OrganizationsModule,
    AddressModule,
    MailModule,
    BloodRequestModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard, // global
    }
  ],
})
export class AppModule { }
