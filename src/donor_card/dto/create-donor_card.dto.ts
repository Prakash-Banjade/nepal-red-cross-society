import { IsString, IsUUID } from "class-validator";

export class CreateDonorCardDto {
    @IsString()
    card_no: string;

    @IsUUID()
    donor: string;
}
