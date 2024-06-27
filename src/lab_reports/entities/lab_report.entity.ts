import { Donation } from "src/donations/entities/donation.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { TestResult } from "src/test_cases/entities/test_result.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity()
export class LabReport extends BaseEntity {
    @Column({ type: 'datetime', nullable: false })
    date: string;

    @Column({ type: 'text' })
    issuedBy: string;

    @OneToOne(() => Donation, (donation) => donation.labReport, { onDelete: 'CASCADE' })
    @JoinColumn()
    donation: Donation;

    @Column({ type: 'simple-array', nullable: true })
    separatedComponents: string[] // format [componentId#componentName]

    @OneToMany(() => TestResult, (testResult) => testResult.labReport, { nullable: true })
    testResults: TestResult[];

    @Column({ type: "simple-array", nullable: true })
    failedReasons: string[] // failed reasons during centrifugation
}
