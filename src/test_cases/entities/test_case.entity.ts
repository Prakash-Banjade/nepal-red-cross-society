import { BaseEntity } from "src/entities/base.entity";
import { LabReport } from "src/lab_reports/entities/lab_report.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class TestCase extends BaseEntity {
    @Column({ type: 'simple-array' })
    particular: string[]

    @Column({ type: 'varchar' })
    desiredResult: string;

    @ManyToOne(() => LabReport, (labReport) => labReport.testCases)
    labReport: LabReport;
}
