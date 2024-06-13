import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
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
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Price must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    price!: number

    @ApiProperty({ type: 'string', description: 'Bag Type name', format: 'uuid' })
    @IsUUID()
    @IsOptional()
    bagType?: string

    @ApiProperty({ type: 'int', default: 0 })
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    quantity!: number;

    @ApiProperty({ type: 'string', description: 'Date of purchase' })
    @IsDateString()
    @IsNotEmpty()
    date!: string;

    @ApiProperty({ type: 'string', description: 'Transaction type', enum: InventoryTransaction })
    @IsNotEmpty()
    @IsEnum(InventoryTransaction)
    transactionType!: InventoryTransaction

    @IsUUID()
    @IsNotEmpty()
    inventoryId!: string
}