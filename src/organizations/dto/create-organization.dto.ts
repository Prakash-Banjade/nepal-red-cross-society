import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrganizationDto {
    @ApiProperty({ description: 'Name of the organization' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Location of the organization' })
    @IsString()
    @IsNotEmpty()
    location: string;
}
