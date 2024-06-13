import { Column } from "typeorm";

export class RequestBloodComponents {

    @Column({ type: 'varchar' })
    componentName: string;

    @Column({ type: 'int' })
    bloodBagNo: number;

}