import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";

export class InventoryItemsQueryDto extends QueryDto {
    @ApiPropertyOptional({ type: String, description: "Inventory Id" })
    @IsNotEmpty()
    @IsUUID()
    inventoryId?: string
}