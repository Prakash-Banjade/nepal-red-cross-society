import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Length, Min } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { District, Province } from "src/types/address.types";
import { BloodGroup, Cast, Gender, Race } from "src/types/global.types";
import { Municipal } from "src/types/municipals.types";

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

    @ApiProperty({ description: 'Donor email', format: 'Email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Donor account password' })
    @IsEmail()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ type: 'enum', enum: Race, description: 'Donor race' })
    @IsEnum(Race, { message: 'Invalid race. Race must be either mahila, janajati, adiwashi, dalit.' })
    race: Race;

    @ApiProperty({ type: 'enum', enum: Cast, description: 'Donor cast' })
    @IsEnum(Cast, { message: 'Invalid cast. Cast must be either ' + Object.values(Cast).join(', ') })
    cast: Cast;



    @ApiProperty({ description: 'Donor phone number (NP)' })
    @IsPhoneNumber('NP')
    phone: string;

    @ApiProperty({ description: 'Donor date of birth' })
    @IsString()
    dob: string;

    @ApiProperty({ type: 'enum', enum: BloodGroup, description: 'Donor blood group' })
    @IsEnum(BloodGroup, { message: 'Invalid blood group. Blood group must be either A+, A-, B+, B-, AB+, AB-, O+, O-.' })
    bloodGroup: BloodGroup;
}
