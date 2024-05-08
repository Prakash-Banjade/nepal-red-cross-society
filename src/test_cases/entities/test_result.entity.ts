import { LabReport } from "src/lab_reports/entities/lab_report.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { TestCase } from "./test_case.entity";
import { BaseEntity } from "src/entities/base.entity";

@Entity()
export class TestResult extends BaseEntity {
    @ManyToOne(() => LabReport, (labReport) => labReport.testResults)
    labReport: LabReport;

    @ManyToOne(() => TestCase, (testCase) => testCase.testResults)
    testCase: TestCase;

    @Column({ type: 'text' })
    result: string;
}