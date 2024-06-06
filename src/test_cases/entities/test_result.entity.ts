import { LabReport } from "src/lab_reports/entities/lab_report.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { TestCase } from "./test_case.entity";
import { BaseEntity } from "src/core/entities/base.entity";
import { TestCaseStatus } from "src/core/types/fieldsEnum.types";

@Entity()
export class TestResult extends BaseEntity {
    @ManyToOne(() => LabReport, (labReport) => labReport.testResults, { nullable: true })
    labReport: LabReport;

    @ManyToOne(() => TestCase, (testCase) => testCase.testResults)
    testCase: TestCase;

    @Column({ type: 'text' })
    obtainedResult: string;

    @Column({ type: 'enum', enum: TestCaseStatus, default: TestCaseStatus.FAIL })
    status: TestCaseStatus;
}