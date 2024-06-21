import { BaseEntity } from "src/core/entities/base.entity";
import { BloodBagStatus, InventoryTransaction } from "src/core/types/fieldsEnum.types";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { Inventory } from "./inventory.entity";
import { BadRequestException } from "@nestjs/common";

@Entity()
export class InventoryItem extends BaseEntity {
    @Column({ type: 'varchar' })
    source: string;

    @Column({ type: 'varchar' })
    destination: string;

    @Column({ type: 'int' })
    price: number

    @Column({ type: 'datetime' })
    date: string;

    @Column({ type: 'varchar', nullable: true })
    bagType: string // only for blood bag inventory

    @Column({ type: 'enum', enum: BloodBagStatus, nullable: true })
    status: BloodBagStatus // only for blood bag inventory

    @Column({ type: 'real' })
    quantity: number;

    @Column({ type: 'enum', enum: InventoryTransaction })
    transactionType: InventoryTransaction

    @ManyToOne(() => Inventory, inventory => inventory.items)
    inventory: Inventory

    @BeforeInsert()
    @BeforeUpdate()
    validateTransaction() {
        if (this.transactionType === InventoryTransaction.ISSUED) {
            if (this.inventory.quantity < this.quantity) throw new BadRequestException(`Insufficient ${this.inventory.name} quantity`);
        }
    }
}