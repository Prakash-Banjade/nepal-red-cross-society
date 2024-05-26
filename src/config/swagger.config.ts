import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AddressModule } from "src/address/address.module";
import { AuthModule } from "src/auth/auth.module";
import { BloodRequestModule } from "src/blood_request/blood_request.module";
import { CertificateModule } from "src/certificate/certificate.module";
import { DonationEventsModule } from "src/donation_events/donation_events.module";
import { DonationsModule } from "src/donations/donations.module";
import { DonorCardModule } from "src/donor_card/donor_card.module";
import { DonorsModule } from "src/donors/donors.module";
import { LabReportsModule } from "src/lab_reports/lab_reports.module";
import { OrganizationsModule } from "src/organizations/organizations.module";
import { TestCasesModule } from "src/test_cases/test_cases.module";
import { UsersModule } from "src/users/users.module";
import { VolunteersModule } from "src/volunteers/volunteers.module";

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Blood Bank API Docs')
        .setDescription('Backend API documentation for Blood Bank')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            }
        )
        .build();


    // swagger
    const document = SwaggerModule.createDocument(app, config, {
        include: [
            AuthModule,
            UsersModule,
            OrganizationsModule,
            DonationsModule,
            DonationEventsModule,
            CertificateModule,
            DonorsModule,
            AddressModule,
            DonorCardModule,
            LabReportsModule,
            TestCasesModule,
            VolunteersModule,
            TestCasesModule,
            BloodRequestModule,
        ],
    });
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Blood Bank API Docs',
        customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
        ],
        customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
        ],
    });
}