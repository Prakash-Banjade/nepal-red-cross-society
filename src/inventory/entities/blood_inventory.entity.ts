import { BaseEntity } from "src/core/entities/base.entity";
import { BloodInventoryStatus, BloodItems, BloodType, RhFactor } from "src/core/types/fieldsEnum.types";
import { Column, Entity, OneToMany } from "typeorm";
import { BloodInventoryItem } from "./blood_inventory-item.entity";

@Entity()
export class BloodInventory extends BaseEntity {
    @Column({ type: 'enum', enum: BloodType })
    bloodType: BloodType

    @Column({ type: 'enum', enum: RhFactor })
    rhFactor: RhFactor;

    @OneToMany(() => BloodInventoryItem, (item) => item.inventory, { onDelete: "CASCADE", nullable: true })
    items: BloodInventoryItem[]

    get quantity() {
        const quantities = {};
        Object.values(BloodItems).forEach((itemType) => {
            quantities[itemType] = this.items?.filter((item) => item.itemType === itemType)?.length || 0;
        });
        return quantities;
    }

    get quantityByItemStatus() {
        const quantities = {};
        Object.values(BloodInventoryStatus).forEach((status) => {
            quantities[status] = this.items?.filter((item) => item.status === status)?.length || 0;
        });
        return quantities;
    }
}
