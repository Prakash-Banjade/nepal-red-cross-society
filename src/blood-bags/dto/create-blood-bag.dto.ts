import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBloodBagDto {
    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Bag number must be a number');
        return parseInt(value);
    })
    @IsOptional()
    bagNo?: number;

    @ApiProperty({ type: String, format: 'uuid' })
    @IsUUID()
    bagType: string;
}
