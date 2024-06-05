import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BloodInventoryStatus, BloodItems, BloodType, RhFactor } from "src/core/types/global.types";

export class CreateBloodInventoryDto {
    @ApiProperty({ type: 'enum', enum: BloodType })
    @IsEnum(BloodType)
    bloodType: BloodType

    @ApiProperty({ description: 'Blood bag number' })
    @IsString()
    @IsNotEmpty()
    bloodBagNo: string;

    @ApiProperty({ type: 'enum', enum: RhFactor })
    @IsEnum(RhFactor)
    rhFactor: RhFactor;

    // @ApiProperty({ type: 'int', default: 0 })
    // @Transform(({ value }) => parseInt(value))
    // quantity: number;

    @ApiProperty({ type: 'enum', enum: BloodItems })
    @IsEnum(BloodItems)
    itemType: BloodItems;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    @IsOptional()
    expiresAt: string = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();

    @ApiProperty({ type: 'enum', enum: BloodInventoryStatus })
    @IsEnum(BloodInventoryStatus)
    @IsOptional()
    status: BloodInventoryStatus;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    itemId: string;
}
