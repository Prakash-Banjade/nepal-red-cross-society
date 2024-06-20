import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { InventoryItem } from "./inventory-item.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { BloodBagStatus, InventoryTransaction } from "src/core/types/fieldsEnum.types";

@Entity()
export class Inventory extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.inventory, { nullable: true })
    items: InventoryItem[]

    @Column({ type: 'varchar', default: 'unit' })
    unit: string

    @ManyToOne(() => Branch, (branch) => branch.inventories)
    branch: Branch

    get quantity() {
        return this.items.reduce((acc, item) => {
            return item.transactionType === InventoryTransaction.ISSUED ? acc - item.quantity : acc + item.quantity
        }, 0)
    }
}
