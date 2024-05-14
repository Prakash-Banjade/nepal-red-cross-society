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
import { VolunteersModule } from './volunteers/volunteers.module';
import { LabReportsModule } from './lab_reports/lab_reports.module';
import { TestCasesModule } from './test_cases/test_cases.module';
import { DonorCardModule } from './donor_card/donor_card.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AddressModule } from './address/address.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      isGlobal: true,
      fileSystemStoragePath: 'public',
      autoDeleteFile: false,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 10 requests per minute
      limit: 60,
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    AuthModule,
    CaslModule,
    DonorsModule,
    DonationsModule,
    DonationEventsModule,
    CertificateModule,
    VolunteersModule,
    LabReportsModule,
    TestCasesModule,
    DonorCardModule,
    OrganizationsModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AbilitiesGuard, // global
    // }
  ],
})
export class AppModule { }
