import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { BloodItems, BloodType, RhFactor } from "src/core/types/global.types";

export class CreateInventoryDto {
    @ApiProperty({ type: 'enum', enum: BloodType })
    @IsEnum(BloodType)
    bloodType: BloodType

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
    expiresAt: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    itemId: string;
}
