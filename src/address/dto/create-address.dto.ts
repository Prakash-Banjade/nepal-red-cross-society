import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { District, Province } from "src/types/address.types";
import { Country } from "src/types/country.types";
import { Municipal } from "src/types/municipals.types";

export class CreateAddressDto {
    @ApiProperty({ enum: Country })
    @IsEnum(Country)
    @IsNotEmpty()
    country: Country;

    @ApiProperty({ type: 'enum', enum: Province, description: 'Province' })
    @IsEnum(Province, { message: 'Invalid province. Province must be either Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' })
    province: Province;

    @ApiProperty({ type: 'enum', enum: District, description: 'District' })
    @IsEnum(District, { message: 'Invalid district.' })
    district: District;

    @ApiProperty({ type: 'enum', enum: Municipal, description: 'Municipality' })
    @IsEnum(Municipal, { message: 'Invalid municipality.' })
    municipality: Municipal;

    @ApiProperty({ description: 'Ward number' })
    @IsInt()
    @Min(1)
    ward: number;

    @ApiProperty({ description: 'Street name' })
    @IsString()
    @IsNotEmpty()
    street: string;
}
