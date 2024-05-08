import { BaseEntity } from "src/entities/base.entity";
import { LabReport } from "src/lab_reports/entities/lab_report.entity";
import { TestCaseResult } from "src/types/global.types";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { TestResult } from "./test_result.entity";

@Entity()
export class TestCase extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string

    @Column({ type: 'varchar' })
    desiredResult: string;

    @OneToMany(() => TestResult, (testResult) => testResult.testCase, { nullable: true })
    testResults: TestResult[];
}
