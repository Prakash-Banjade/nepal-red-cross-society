import { BaseEntity } from "src/core/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Inventory extends BaseEntity {
    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'varchar' })
    source: string;

    @Column({ type: 'datetime' })
    purchaseDate: string;
}
