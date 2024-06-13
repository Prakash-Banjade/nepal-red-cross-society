import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";

export class CreateHospitalDto extends CreateAddressDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty()
    @IsPhoneNumber('NP')
    @IsNotEmpty()
    primaryContact!: string

    @ApiProperty()
    @IsPhoneNumber('NP')
    @IsOptional()
    secondaryContact?: string
}
