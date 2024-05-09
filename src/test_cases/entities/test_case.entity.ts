import { BaseEntity } from "src/core/entities/base.entity";
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
