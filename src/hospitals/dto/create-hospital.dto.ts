import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
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
    @Transform(({ value }) => value?.length || null)
    @IsOptional()
    secondaryContact?: string
}
