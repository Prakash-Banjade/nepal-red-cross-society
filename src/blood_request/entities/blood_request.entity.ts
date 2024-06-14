import { BaseEntity } from "src/core/entities/base.entity";
import { BloodItems, BloodType, Gender, RhFactor } from "src/core/types/fieldsEnum.types";
import { Hospital } from "src/hospitals/entities/hospital.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BloodRequestCharge } from "./blood-request-charge.entity";
import { RequestedBloodBag } from "./requestedBloodBag.entity";

@Entity()
export class BloodRequest extends BaseEntity {
    @Column({ type: 'int' })
    billNo: number

    @ManyToOne(() => Hospital, (hospital) => hospital.bloodRequests)
    hospital: Hospital

    @Column({ type: 'varchar' })
    patientName: string;

    @Column({ type: 'int' })
    patientAge: number;

    @Column({ type: 'enum', enum: Gender })
    patientGender: Gender;

    @Column({ type: 'varchar' })
    inpatientNo: string;

    @Column({ type: 'int' })
    ward: number;

    @Column({ type: 'int', nullable: true })
    bedNo?: number;

    @Column({ type: 'varchar', nullable: true })
    attendingConsultant?: string;

    @OneToMany(() => BloodRequestCharge, (bloodRequestCharge) => bloodRequestCharge.bloodRequest, { nullable: true }) // they are mandatory due as payload in create request, just to prevent not null constraint nullable is true
    bloodRequestCharges: BloodRequestCharge[]

    @OneToMany(() => RequestedBloodBag, (requestedBloodBag) => requestedBloodBag.bloodRequest, { nullable: true }) // they are mandatory due as payload in create request, just to prevent not null constraint nullable is true
    requestedBloodBags: RequestedBloodBag[]

    @Column({ type: 'enum', enum: BloodType })
    bloodType: BloodType;

    @Column({ type: 'enum', enum: RhFactor })
    rhFactor: RhFactor;

    @Column({ type: 'int', nullable: true })
    previouslyTransfused?: number;

    @Column({ type: 'boolean' })
    reactionToPreviousBlood: boolean

    @Column({ type: 'boolean' })
    reactionToPreviousPlasma: boolean

    @Column({ type: 'varchar', nullable: true })
    doctor?: string;

    @Column({ type: 'text' })
    documentFront: string;

    @Column({ type: 'text' })
    documentBack: string;
}
