import { Certificate } from "src/certificate/entities/certificate.entity";
import { DonationEvent } from "src/donation_events/entities/donation_event.entity";
import { Donor } from "src/donors/entities/donor.entity";
import { BaseEntity } from "src/entities/base.entity";
import { LabReport } from "src/lab_reports/entities/lab_report.entity";
import { Organization } from "src/organizations/entities/organization.entity";
import { DonationStatus, DonationType } from "src/types/global.types";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Donation extends BaseEntity {
    @ManyToOne(() => Donor, donor => donor.donations)
    donor: Donor

    @ManyToOne(() => DonationEvent, donation_event => donation_event.donations)
    donation_event: DonationEvent;

    @OneToOne(() => Certificate, certificate => certificate.donation, { nullable: true })
    certificate: Certificate;

    @Column({ type: 'enum', enum: DonationType })
    donationType: DonationType

    // based on the donation type the organization will be defined, if donation type is individual, organization will be null else defined
    @ManyToOne(() => Organization, (organization) => organization.donations, { nullable: true })
    organization: Organization

    @Column({ type: "varchar" })
    bloodBagNo: string;

    @Column({ type: "enum", enum: DonationStatus, default: DonationStatus.PENDING })
    status: DonationStatus

    // donation with failed status will have failedReason
    @Column({ type: "simple-array", nullable: true })
    failedReason: string[]

    @Column({ type: "varchar" })
    verifiedBy: string

    @OneToOne(() => LabReport, lab_report => lab_report.donation, { nullable: true })
    labReport: LabReport

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        if (this.donationType === DonationType.INDIVIDUAL) {
            this.organization = null;
        }
    }
}