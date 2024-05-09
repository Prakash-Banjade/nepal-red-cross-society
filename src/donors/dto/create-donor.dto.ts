import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { BloodGroup, Cast, Gender, Race } from "src/core/types/global.types";

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

    @ApiProperty({ description: 'Donor email', format: 'Email', default: 'techiesakar@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'enum', enum: Race, description: 'Donor race' })
    @IsEnum(Race, { message: 'Invalid race. Race must be either mahila, janajati, adiwashi, dalit.' })
    race: Race;

    @ApiProperty({ type: 'enum', enum: Cast, description: 'Donor cast' })
    @IsEnum(Cast, { message: 'Invalid cast. Cast must be either ' + Object.values(Cast).join(', ') })
    cast: Cast;

    @ApiProperty({ description: 'Donor phone number (NP)', default: '9841234567' })
    @IsPhoneNumber('NP')
    phone: string;

    @ApiProperty({ description: 'Donor date of birth', default: '2024-05-09T07:12:13.012Z' })
    @IsString()
    @IsDateString()
    dob: string;

    @ApiProperty({ type: 'enum', enum: BloodGroup, description: 'Donor blood group' })
    @IsEnum(BloodGroup, { message: 'Invalid blood group. Blood group must be either A+, A-, B+, B-, AB+, AB-, O+, O-.' })
    bloodGroup: BloodGroup;

    // @ApiProperty({ type: 'string', format: 'binary', description: 'Donor image' })
    // image: FileSystemStoredFile;
}
