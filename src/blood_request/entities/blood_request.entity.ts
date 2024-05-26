import { BaseEntity } from "src/core/entities/base.entity";
import { BloodItems, Gender } from "src/core/types/global.types";
import { Column, Entity } from "typeorm";

@Entity()
export class BloodRequest extends BaseEntity {
    @Column({ type: 'varchar' })
    hospitalName: string;

    @Column({ type: 'varchar' })
    hospitalAddress: string;

    @Column({ type: 'varchar' })
    patientName: string;

    @Column({ type: 'int' })
    patientAge: number;

    @Column({ type: 'enum', enum: Gender })
    patientGender: Gender;

    @Column({ type: 'varchar' })
    inpatientNo: string;

    @Column({ type: 'varchar' })
    ward: string;

    @Column({ type: 'varchar' })
    bedNo: string;

    @Column({ type: 'varchar' })
    attendingConsultant: string;

    @Column({ type: 'simple-array' })
    bloodItems: BloodItems[]

    @Column({ type: 'int' })
    previouslyTransfused: number;

    @Column({ type: 'boolean' })
    reactionToPreviousBlood: boolean

    @Column({ type: 'boolean' })
    reactionToPreviousPlasma: boolean

    @Column({ type: 'varchar' })
    doctor: string;
}
