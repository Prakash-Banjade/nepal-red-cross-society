import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateBloodBagDto } from "src/blood-bags/dto/create-blood-bag.dto";
import { CONSTANTS } from "src/CONSTANTS";
import { BloodComponent, BloodInventoryStatus, BloodItems, BloodType, InventoryTransaction, RhFactor } from "src/core/types/fieldsEnum.types";

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

    @ApiProperty({ type: 'string'})
    @IsString()
    @IsNotEmpty()
    component!: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsOptional()
    expiry?: string = '';

    @ApiProperty({ type: 'enum', enum: BloodInventoryStatus })
    @IsEnum(BloodInventoryStatus)
    @IsOptional()
    status: BloodInventoryStatus;

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    bloodBag!: string
}
