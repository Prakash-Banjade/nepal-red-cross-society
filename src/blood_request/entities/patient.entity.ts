import { BaseEntity } from "src/core/entities/base.entity";
import { BloodType, Gender, RhFactor } from "src/core/types/fieldsEnum.types";
import { Column, Entity, OneToMany } from "typeorm";
import { BloodRequest } from "./blood_request.entity";
import { District } from "src/core/types/districts.types";

@Entity()
export class Patient extends BaseEntity {
    @Column({ type: 'varchar' })
    patientName: string;

    @Column({ type: 'int' })
    patientAge: number;

    @Column({ type: 'enum', enum: Gender })
    patientGender: Gender;

    @Column({ type: 'varchar', nullable: true })
    inpatientNo?: string;

    @Column({ type: 'enum', enum: BloodType, nullable: true })
    bloodType?: BloodType;

    @Column({ type: 'enum', enum: RhFactor, nullable: true })
    rhFactor?: RhFactor;

    @Column({ type: 'varchar', nullable: true })
    contact?: string;

    @Column({ type: 'varchar', nullable: true })
    permanentPaper?: string;

    @Column({ type: 'varchar', nullable: true })
    permanentPaperType?: string;

    @Column({ type: 'varchar', nullable: true })
    citizenshipNo: string;

    @Column({ type: 'datetime', nullable: true })
    issueDate: string

    @Column({ type: 'enum', enum: District, nullable: true })
    issuedFrom: District

    @Column({ type: 'int', nullable: true, default: 0 })
    previouslyTransfused?: number;

    @Column({ type: 'boolean', nullable: true })
    reactionToPreviousBlood?: boolean

    @Column({ type: 'boolean', nullable: true })
    reactionToPreviousPlasma?: boolean

    @OneToMany(() => BloodRequest, (bloodRequest) => bloodRequest.patient)
    bloodRequests: BloodRequest[]
}