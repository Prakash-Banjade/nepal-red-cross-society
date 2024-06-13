import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsString, Length } from "class-validator";

class Component {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    componentName!: string

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Expiry in days must be a number');
        return parseInt(value);
    })
    expiryInDays: number;
}

export class CreateBagTypeDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({ isArray: true, type: Component })
    @IsDefined()
    @IsArray({ always: true })
    bloodComponents!: Component[];

}
