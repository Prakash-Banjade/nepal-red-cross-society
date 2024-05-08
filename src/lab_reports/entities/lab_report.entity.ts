import { Donation } from "src/donations/entities/donation.entity";
import { BaseEntity } from "src/entities/base.entity";
import { TestCase } from "src/test_cases/entities/test_case.entity";
import { TestResult } from "src/test_cases/entities/test_result.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity()
export class LabReport extends BaseEntity {
    @Column({ type: 'text' })
    date: string

    @Column({ type: 'text' })
    issuedBy: string;

    @OneToOne(() => Donation, (donation) => donation.labReport)
    donation: Donation;

    @OneToMany(() => TestResult, (testResult) => testResult.labReport, { nullable: true })
    testResults: TestResult[];
}
