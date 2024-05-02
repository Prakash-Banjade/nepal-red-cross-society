import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCertificateDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    certificateId: number;
}
