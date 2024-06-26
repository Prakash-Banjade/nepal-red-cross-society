import { BaseEntity } from "src/core/entities/base.entity";
import { BloodType, RhFactor } from "src/core/types/fieldsEnum.types";
import { Hospital } from "src/hospitals/entities/hospital.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BloodRequestCharge } from "./blood-request-charge.entity";
import { RequestedBloodBag } from "./requestedBloodBag.entity";
import { Patient } from "./patient.entity";

@Entity()
export class BloodRequest extends BaseEntity {
    @Column({ type: 'int' })
    xmNo: number

    @ManyToOne(() => Hospital, (hospital) => hospital.bloodRequests, { onDelete: 'RESTRICT' })
    hospital: Hospital

    @ManyToOne(() => Patient, (patient) => patient.bloodRequests, { onDelete: 'RESTRICT' })
    patient: Patient

    @Column({ type: 'varchar', nullable: true })
    ward: string;

    @Column({ type: 'int', nullable: true })
    bedNo?: number;

    @Column({ type: 'varchar', nullable: true })
    disease?: string;

    @Column({ type: 'varchar', nullable: true })
    attendingConsultant?: string;

    @OneToMany(() => BloodRequestCharge, (bloodRequestCharge) => bloodRequestCharge.bloodRequest, { nullable: true }) // they are mandatory due as payload in create request, just to prevent not null constraint nullable is true
    bloodRequestCharges: BloodRequestCharge[]

    @Column({ type: 'int', nullable: true }) // this field will have value, just to prevent not null contstraint, nullable is true
    totalAmount: number

    @OneToMany(() => RequestedBloodBag, (requestedBloodBag) => requestedBloodBag.bloodRequest, { nullable: true }) // they are mandatory due as payload in create request, just to prevent not null constraint nullable is true
    requestedBloodBags: RequestedBloodBag[]

    @Column({ type: 'enum', enum: BloodType })
    bloodType: BloodType;

    @Column({ type: 'enum', enum: RhFactor })
    rhFactor: RhFactor;

    @Column({ type: 'simple-array', nullable: true }) // this field will have value, just to prevent not null contstraint, nullable is true
    requestedComponents: string[] // format: ['componentName-quantity']

    @Column({ type: 'simple-array', nullable: true }) // this field will have value, just to prevent not null contstraint, nullable is true
    currentCharges: string[] // format: ['particular-quantity-rate']

    @Column({ type: 'varchar', nullable: true })
    doctor?: string;

    @Column({ type: 'text', nullable: true })
    documentFront: string;

    @Column({ type: 'text', nullable: true })
    documentBack: string;

    @Column({ type: 'varchar', default: 'Citizenship' })
    permanentPaper?: string;
}
