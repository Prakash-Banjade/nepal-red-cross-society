import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, Min, ValidateIf } from "class-validator";
import { Country } from "src/core/types/country.types";
import { District } from "src/core/types/districts.types";
import { Municipal } from "src/core/types/municipals.types";
import { Province } from "src/core/types/provinces.types";

export class CreateAddressDto {
    @ApiProperty({ enum: Country })
    @IsEnum(Country)
    @IsNotEmpty()
    country!: Country;

    @ApiPropertyOptional({ type: 'enum', enum: Province, description: 'Province' })
    @IsEnum(Province, { message: 'Invalid province. Province must be either Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' })
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    province?: Province;

    @ApiPropertyOptional({ type: 'enum', enum: District, description: 'District' })
    @IsEnum(District, { message: 'Invalid district.' })
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    district?: District;

    @ApiPropertyOptional({ type: 'enum', enum: Municipal, description: 'Municipality' })
    @IsEnum(Municipal, { message: 'Invalid municipality.' })
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    municipality?: Municipal;

    @ApiPropertyOptional({ description: 'Ward number', default: 1 })
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    @ValidateIf((object) => object.country === Country.NP) // field is required only if country is Nepal
    ward?: number;

    @ApiProperty({ description: 'Street name' })
    @IsString()
    @IsNotEmpty()
    street!: string;
}
