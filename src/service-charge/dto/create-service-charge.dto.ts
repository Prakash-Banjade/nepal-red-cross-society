import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateServiceChargeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    particular!: string;

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Bag number must be a number');
        return parseInt(value);
    })
    publicRate!: number;
}
