import { Certificate } from "src/certificate/entities/certificate.entity";
import { DonationEvent } from "src/donation_events/entities/donation_event.entity";
import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { LabReport } from "src/lab_reports/entities/lab_report.entity";
import { Organization } from "src/organizations/entities/organization.entity";
import { DonationStatus, DonationType } from "src/core/types/fieldsEnum.types";
import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { BloodBag } from "src/blood-bags/entities/blood-bag.entity";

@Entity()
export class Donation extends BaseEntity {
    @ManyToOne(() => Donor, donor => donor.donations, { onDelete: 'RESTRICT' })
    donor: Donor

    @Column({ type: 'int' })
    donorAge: number

    @ManyToOne(() => DonationEvent, donation_event => donation_event.donations, { nullable: true })
    donation_event: DonationEvent;

    @OneToOne(() => Certificate, certificate => certificate.donation, { nullable: true })
    certificate: Certificate;

    @Column({ type: 'enum', enum: DonationType })
    donationType: DonationType

    // based on the donation type the organization will be defined, if donation type is individual, organization will be null else defined
    @ManyToOne(() => Organization, (organization) => organization.donations, { nullable: true })
    organization: Organization

    @OneToOne(() => BloodBag, blood_bag => blood_bag.donation)
    bloodBag: BloodBag;

    @Column({ type: "enum", enum: DonationStatus, default: DonationStatus.PENDING })
    status: DonationStatus

    // donation with failed status will have failedReason
    @Column({ type: "simple-array", nullable: true })
    failedReason: string[]

    @Column({ type: "varchar", nullable: true })
    verifiedBy: string

    @OneToOne(() => LabReport, lab_report => lab_report.donation, { nullable: true })
    labReport: LabReport

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        if (this.donation_event?.technicians?.length === 0 && this.donationType === DonationType.ORGANIZATION) {
            throw new BadRequestException("Donation event must have atleast one technician");
        }

        if (this.donationType === DonationType.INDIVIDUAL) {
            this.organization = null;
            this.donation_event = null;
        }

        if (this.status !== DonationStatus.FAILED) {
            this.failedReason = null;
        }

        if (this.verifiedBy === null) {
            this.labReport = null;
        }
    }
}