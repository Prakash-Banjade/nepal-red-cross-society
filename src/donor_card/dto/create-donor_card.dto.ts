import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateDonorCardDto {
    @ApiProperty({ type: 'string', description: 'Donor card number', example: '123456789' })
    @IsString()
    @IsNotEmpty()
    card_no: string;

    @ApiProperty({ type: 'string', format: 'uuidv4', description: 'Donor id' })
    @IsUUID()
    @IsNotEmpty()
    donor: string;
}
