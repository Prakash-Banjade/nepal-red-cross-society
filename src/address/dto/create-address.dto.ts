import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateIf } from "class-validator";
import { District, Province } from "src/core/types/address.types";
import { Country } from "src/core/types/country.types";
import { Municipal } from "src/core/types/municipals.types";

export class CreateAddressDto {
    @ApiProperty({ enum: Country })
    @IsEnum(Country)
    @IsNotEmpty()
    country!: Country;

    @ApiPropertyOptional({ type: 'enum', enum: Province, description: 'Province' })
    @IsEnum(Province, { message: 'Invalid province. Province must be either Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' })
    @ValidateIf(function () { return this.country === 'Nepal' })
    province?: Province;

    @ApiPropertyOptional({ type: 'enum', enum: District, description: 'District' })
    @IsEnum(District, { message: 'Invalid district.' })
    @ValidateIf(function () { return this.country === 'Nepal' })
    district?: District;

    @ApiPropertyOptional({ type: 'enum', enum: Municipal, description: 'Municipality' })
    @IsEnum(Municipal, { message: 'Invalid municipality.' })
    @ValidateIf(function () { return this.country === 'Nepal' })
    municipality?: Municipal;
    
    @ApiPropertyOptional({ description: 'Ward number' })
    @IsInt()
    @Min(1)
    @ValidateIf(function () { return this.country === 'Nepal' })
    ward?: number;

    @ApiProperty({ description: 'Street name' })
    @IsString()
    @IsNotEmpty()
    street!: string;
}
