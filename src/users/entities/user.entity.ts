import { BaseEntity } from "src/core/entities/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Roles } from "src/core/types/global.types";
import { Donor } from "src/donors/entities/donor.entity";

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

}