import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Roles } from "src/core/types/global.types";
import { Donor } from "src/donors/entities/donor.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { BloodRequest } from "src/blood_request/entities/blood_request.entity";

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar' })
    firstName: string;

    @Column({ type: 'varchar' })
    lastName: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER })
    role: Roles;

    @ManyToOne(() => Branch, (branch) => branch.users, { nullable: true })
    branch: Branch

    @Column({ type: 'varchar', nullable: true })
    image: string;

    @Column({ type: 'varchar', nullable: true })
    refresh_token: string;

    @OneToOne(() => Donor, (donor) => donor.account, { nullable: true, onDelete: 'CASCADE' })
    donor: Donor;

    @BeforeInsert()
    hashPassword() {
        if (!this.password) throw new Error('Password required');

        this.password = bcrypt.hashSync(this.password, 10);
    }

    @BeforeInsert()
    @BeforeUpdate()
    validateEmail() {
        if (!this.email) throw new Error('Email required');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.email)) throw new Error('Invalid email');
    }

    @BeforeInsert()
    @BeforeUpdate()
    setBranch() {
        if (this.role === Roles.USER) this.branch = null
    }

    // WATCHING ACTIVITIES
    @OneToMany(() => BloodRequest, (bloodRequest) => bloodRequest.createdBy, { nullable: true })
    bloodRequests: BloodRequest[]

}