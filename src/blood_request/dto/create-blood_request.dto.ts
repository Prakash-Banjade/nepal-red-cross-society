import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Matches } from "class-validator";
import { BloodItems, Gender } from "src/core/types/global.types";

export class CreateBloodRequestDto {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'Name can only contain alphabets' })
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
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    patientAge: number;

    @ApiProperty({ type: 'enum', enum: Gender })
    @IsEnum(Gender)
    patientGender: Gender;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    inpatientNo: string;

    @ApiProperty({ type: 'number' })
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    ward: number;

    @ApiProperty({ type: 'number' })
    @Transform(({ value }) => parseInt(value))
    @IsNotEmpty()
    bedNo: number;

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
