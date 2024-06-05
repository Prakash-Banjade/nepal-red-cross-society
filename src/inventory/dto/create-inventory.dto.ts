import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

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
    quantity!: number;

    @ApiProperty({ type: 'string', description: 'Date of purchase' })
    @IsDateString()
    @IsNotEmpty()
    purchaseDate!: string;
}
