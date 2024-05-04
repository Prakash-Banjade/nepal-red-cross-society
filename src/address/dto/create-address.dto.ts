import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { District, Province } from "src/types/address.types";
import { Municipal } from "src/types/municipals.types";

export class CreateAddressDto {
    @IsEnum(Province)
    @IsNotEmpty()
    province: Province

    @IsEnum(District)
    district: District

    @IsEnum(Municipal)
    @IsNotEmpty()
    municipality: Municipal

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    ward: number

    @IsString()
    @IsNotEmpty()
    street: string
}
