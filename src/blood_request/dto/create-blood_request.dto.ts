import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { BloodItems, Gender } from "src/core/types/global.types";

export class CreateBloodRequestDto {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    hospitalName: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    hospitalAddress: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    patientName: string;

    @ApiProperty({ type: Number })
    patientAge: number;

    @ApiProperty({ type: 'enum', enum: Gender })
    @IsEnum(Gender)
    patientGender: Gender;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    inpatientNo: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    ward: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    bedNo: string;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    attendingConsultant: string;

    @ApiProperty({ type: 'enum', enum: BloodItems, isArray: true })
    @IsEnum(BloodItems, { each: true })
    bloodItems: BloodItems[]

    @ApiProperty({ type: 'int' })
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    previouslyTransfused: number;

    @ApiProperty({ type: 'boolean', default: false })
    @IsBoolean()
    @IsNotEmpty()
    reactionToPreviousBlood: boolean

    @ApiProperty({ type: 'boolean', default: false })
    @IsBoolean()
    @IsNotEmpty()
    reactionToPreviousPlasma: boolean

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    doctor: string;
}
