import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";

export class CreateOrganizationDto extends CreateAddressDto {
    @ApiProperty({ description: 'Name of the organization' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Contact number of the organization' })
    @IsPhoneNumber('NP', { message: 'Contact number is not valid' })
    @IsNotEmpty()
    contact: string;

    @ApiProperty({ description: 'Owner of the organization' })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({ description: 'Representative contact of the organization' })
    @IsPhoneNumber('NP', { message: 'Representative contact number is not valid' })
    @IsNotEmpty()
    representativeContact: string;
}
