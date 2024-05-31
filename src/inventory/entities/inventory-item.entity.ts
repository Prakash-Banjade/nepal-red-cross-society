import { BloodItems } from "src/core/types/global.types";
import { Column, Entity, ManyToOne } from "typeorm";
import { Inventory } from "./inventory.entity";
import { BaseEntity } from "src/core/entities/base.entity";

@Entity('inventory_items')
export class InventoryItem extends BaseEntity {
    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column({ type: 'enum', enum: BloodItems })
    itemType: BloodItems;

    @ManyToOne(() => Inventory, inventory => inventory.items)
    inventory: Inventory
}