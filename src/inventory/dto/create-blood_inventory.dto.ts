import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { QueryDto } from "src/core/dto/queryDto";
import { BloodInventoryStatus, BloodType, InventoryTransaction, RhFactor } from "src/core/types/fieldsEnum.types";

export class CreateBloodInventoryDto {
    @ApiProperty({ type: 'enum', enum: BloodType })
    @IsEnum(BloodType)
    bloodType: BloodType

    @ApiProperty({ type: 'enum', enum: RhFactor })
    @IsEnum(RhFactor)
    rhFactor: RhFactor;

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

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsNotEmpty()
    date!: string

    @ApiProperty({ type: 'string', description: 'Type of item', enum: InventoryTransaction })
    @IsNotEmpty()
    @IsEnum(InventoryTransaction)
    transactionType!: InventoryTransaction

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    component!: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Expiry must be a number');
        return parseInt(value);
    })
    @IsOptional()
    expiry?: number;

    @ApiProperty({ type: 'enum', enum: BloodInventoryStatus })
    @IsEnum(BloodInventoryStatus)
    @IsOptional()
    status?: BloodInventoryStatus;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsString()
    bagType?: string;

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    @IsOptional()
    bloodBagId?: string

    @ApiProperty({ type: Number, default: 1 })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Quantity must be a number');
        return parseInt(value);
    })
    @IsOptional()
    quantity?: number = 1;

    // @ApiProperty({ type: 'int', default: 0 })
    // @Transform(({ value }) => {
    //     if (isNaN(parseInt(value))) throw new BadRequestException('Blood bag no. be a number');
    //     return parseInt(value);
    // })
    // @ValidateIf(o => !o.bloodBagId)
    // bloodBagNo?: number

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    @ValidateIf(o => o.bloodBagNo)
    bagTypeId?: string
}

export class BloodInventoryIssueDto {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'uuid' } })
    @IsNotEmpty()
    @IsUUID('all', { message: 'Inventory Id must be a valid UUID', each: true })
    inventoryIds!: string[]

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

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsNotEmpty()
    date!: string
}

export class AvailableInventoryDto extends QueryDto {
    @ApiProperty({ type: 'enum', enum: BloodType })
    @IsEnum(BloodType)
    bloodType: BloodType

    @ApiProperty({ type: 'enum', enum: RhFactor })
    @IsEnum(RhFactor)
    rhFactor: RhFactor;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    component!: string;
}