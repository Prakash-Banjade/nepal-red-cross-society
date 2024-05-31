import { BaseEntity } from "src/core/entities/base.entity";
import { BloodItems, BloodType, RhFactor } from "src/core/types/global.types";
import { Column, Entity, OneToMany } from "typeorm";
import { InventoryItem } from "./inventory-item.entity";

@Entity()
export class Inventory extends BaseEntity {
    @Column({ type: 'enum', enum: BloodType })
    bloodType: BloodType

    @Column({ type: 'enum', enum: RhFactor })
    rhFactor: RhFactor;

    @OneToMany(() => InventoryItem, (item) => item.inventory, { onDelete: "CASCADE" })
    items: InventoryItem[]
}
