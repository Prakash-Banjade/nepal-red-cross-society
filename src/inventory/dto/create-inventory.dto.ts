import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { BloodItems, BloodType, RhFactor } from "src/core/types/global.types";

export class CreateInventoryDto {
    @ApiProperty({ type: 'string', description: 'Item name' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ type: 'string', description: 'Place where item come from' })
    @IsString()
    @IsNotEmpty()
    source!: string;

    @ApiProperty({ type: 'int', default: 0 })
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    quantity: number;
}
