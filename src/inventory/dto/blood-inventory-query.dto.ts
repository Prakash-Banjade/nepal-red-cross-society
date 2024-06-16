import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { BloodInventoryStatus, BloodItems, BloodType, InventoryTransaction, RhFactor } from "src/core/types/fieldsEnum.types";

export class BloodInventoryQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: 'enum', enum: BloodInventoryStatus, default: BloodInventoryStatus.USABLE })
    @IsOptional()
    status?: BloodInventoryStatus = BloodInventoryStatus.USABLE;

    @ApiPropertyOptional({ type: 'enum', enum: BloodItems })
    @IsOptional()
    itemType?: BloodItems

    @ApiPropertyOptional({ type: 'enum', enum: BloodType, description: 'Donor blood type' })
    @IsOptional()
    bloodType?: BloodType;

    @ApiPropertyOptional({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    @IsOptional()
    rhFactor?: RhFactor;

    @ApiPropertyOptional({ type: 'enum', enum: InventoryTransaction, description: "Transaction Type" })
    @IsOptional()
    transactionType?: InventoryTransaction

    @ApiPropertyOptional({ type: 'string', description: "Component Type" })
    @IsOptional()
    component?: string
}