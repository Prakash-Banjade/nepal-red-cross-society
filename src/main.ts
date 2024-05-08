import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DonationsModule } from './donations/donations.module';
import { DonationEventsModule } from './donation_events/donation_events.module';
import { CertificateModule } from './certificate/certificate.module';
import { DonorsModule } from './donors/donors.module';
import { AddressModule } from './address/address.module';
import { DonorCardModule } from './donor_card/donor_card.module';
import { LabReportsModule } from './lab_reports/lab_reports.module';
import { TestCasesModule } from './test_cases/test_cases.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { setupSwagger } from './config/swagger.config';
const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  setupSwagger(app);

  app.listen(PORT).then(() => {
    console.log(`App running on port ${PORT}`)
  })
}
bootstrap();
