import { BaseEntity } from "src/core/entities/base.entity";
import { InventoryTransaction } from "src/core/types/fieldsEnum.types";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { Inventory } from "./inventory.entity";

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
    type: string

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
            if (this.inventory.quantity < this.quantity) throw new Error('Insufficient quantity');
            this.source = 'SELF';
        }
        if (this.transactionType === InventoryTransaction.RECEIVED) {
            this.destination = 'SELF';
        }
    }
}