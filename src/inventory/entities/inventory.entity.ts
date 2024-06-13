import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { InventoryItem } from "./inventory-item.entity";
import { Branch } from "src/branch/entities/branch.entity";
import { InventoryTransaction } from "src/core/types/fieldsEnum.types";

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

    get bloodBagCount() {
        const bags = {}

        this.items.forEach(item => {
            if (item.bagType in bags) {
                if (item.transactionType === InventoryTransaction.ISSUED) bags[item.bagType] -= item.quantity
                if (item.transactionType === InventoryTransaction.RECEIVED) bags[item.bagType] += item.quantity
            } else {
                bags[item.bagType] = item.transactionType === InventoryTransaction.ISSUED ? -item.quantity : item.quantity
            }
        })

        return bags
    }
}
