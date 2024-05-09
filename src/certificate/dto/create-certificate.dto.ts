import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";

export class CreateCertificateDto {
    @ApiProperty({ type: 'number', example: 555, format: 'int32' })
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    certificateId: number;

    @ApiProperty({ format: 'uuidv4', type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    donation: string;
}
