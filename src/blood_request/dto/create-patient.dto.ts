import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Gender } from "src/core/types/fieldsEnum.types";

export class CreatePatientDto {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    patientName: string;

    @ApiProperty({ type: Number })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Patient Age must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    @IsNotEmpty()
    patientAge: number;

    @ApiProperty({ type: 'enum', enum: Gender })
    @IsEnum(Gender)
    patientGender: Gender;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    inpatientNo: string;
}