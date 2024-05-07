import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateCertificateDto {
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    certificateId: number;

    @ApiProperty({ format: 'uuidv4', type: 'string' })
    @IsUUID()
    @IsNotEmpty()
    donation: string;
}
