import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { BloodType, Cast, Gender, Race, RhFactor } from "src/core/types/global.types";

export class CreateDonorDto extends CreateAddressDto {
    @ApiProperty({ description: 'Donor first name' })
    @IsString()
    @Length(3, 20)
    firstName: string;

    @ApiProperty({ description: 'Donor last name' })
    @IsString()
    @Length(3, 20)
    lastName: string;

    @ApiProperty({ type: 'enum', enum: Gender, description: 'Donor gender' })
    @IsEnum(Gender, { message: 'Invalid gender. Gender must be either male or female or other.' })
    gender: Gender;

    @ApiProperty({ description: 'Donor email', format: 'Email', example: 'techiesakar@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'enum', enum: Race, description: 'Donor race' })
    @IsEnum(Race, { message: 'Invalid race. Race must be either mahila, janajati, adiwashi, dalit.' })
    race: Race;

    @ApiProperty({ type: 'enum', enum: Cast, description: 'Donor cast' })
    @IsEnum(Cast, { message: 'Invalid cast. Cast must be either ' + Object.values(Cast).join(', ') })
    cast: Cast;

    @ApiProperty({ description: 'Donor phone number (NP)', example: '9841234567' })
    @IsPhoneNumber('NP')
    phone: string;

    @ApiProperty({ description: 'Donor date of birth', example: '2024-05-09T07:12:13.012Z' })
    @IsString()
    @IsDateString()
    dob: string;

    @ApiProperty({ description: 'Donor weight', example: 50 })
    @IsNotEmpty()
    weight: number;

    @ApiProperty({ type: 'enum', enum: BloodType, description: 'Donor blood group' })
    @IsEnum(BloodType, { message: 'Invalid blood group. Blood group must be either ' + Object.values(BloodType).join(', ') })
    bloodType: BloodType;

    @ApiProperty({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    rhFactor: RhFactor;

    // @ApiProperty({ type: 'string', format: 'binary', description: 'Donor image' })
    // image: FileSystemStoredFile;
}
