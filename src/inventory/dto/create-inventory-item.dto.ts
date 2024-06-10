import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { InventoryTransaction } from "src/core/types/fieldsEnum.types";

export class CreateInventoryItemDto {
    @ApiProperty({ type: 'string', description: 'Place where item come from' })
    @IsString()
    @IsNotEmpty()
    source!: string;

    @ApiProperty({ type: 'string', description: 'Place where item go to' })
    @IsString()
    @IsNotEmpty()
    destination!: string;

    @ApiProperty({ type: 'int', default: 0 })
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    quantity!: number;

    @ApiProperty({ type: 'string', description: 'Date of purchase' })
    @IsDateString()
    @IsNotEmpty()
    date!: string;

    @ApiProperty({ type: 'string', description: 'Type of item', enum: InventoryTransaction })
    @IsNotEmpty()
    @IsEnum(InventoryTransaction)
    itemType!: InventoryTransaction

    @IsUUID()
    @IsNotEmpty()
    inventoryId!: string
}