import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { InventoryTransaction } from "src/core/types/fieldsEnum.types";

export class InventoryItemsQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: String, description: "Inventory Id" })
    @IsNotEmpty()
    @IsUUID()
    inventoryId: string

    @ApiPropertyOptional({ type: 'enum', enum: InventoryTransaction, description: "Transaction Type" })
    @IsOptional()
    transactionType?: InventoryTransaction
}