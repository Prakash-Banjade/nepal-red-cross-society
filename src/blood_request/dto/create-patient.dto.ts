import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateIf } from "class-validator";
import { FileSystemStoredFile } from "nestjs-form-data";
import { District } from "src/core/types/districts.types";
import { BloodType, Gender, RhFactor } from "src/core/types/fieldsEnum.types";

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

    @ApiPropertyOptional({ type: 'string' })
    @IsPhoneNumber('NP')
    @IsOptional()
    contact?: string;

    @ApiProperty({ type: 'enum', enum: Gender })
    @IsEnum(Gender)
    patientGender: Gender;

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsOptional()
    inpatientNo?: string;

    @ApiProperty({ type: 'enum', enum: BloodType, description: 'Blood type' })
    @IsEnum(BloodType, { message: 'Invalid blood type. Blood type must be either ' + Object.values(BloodType).join(', ') })
    bloodType!: BloodType;

    @ApiProperty({ type: 'enum', enum: RhFactor, description: 'Blood RH-factor' })
    @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    rhFactor!: RhFactor;

    @ApiPropertyOptional({ type: 'int' })
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Previously Transfused must be a number');
        return parseInt(value);
    })
    @IsNotEmpty()
    @IsOptional()
    previouslyTransfused?: number;

    @ApiProperty({ type: 'boolean', default: false })
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    reactionToPreviousBlood: boolean

    @ApiProperty({ type: 'boolean', default: false })
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    reactionToPreviousPlasma: boolean

    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty({ message: 'Either none or all of the fields: Citizenship Number, Issued From, Issued Date must be provided' })
    @ValidateIf((o) => (o.issuedFrom?.length > 0 || o.issueDate?.length > 0))
    citizenshipNo?: string;

    @ApiProperty({ type: 'enum', enum: District, description: 'District' })
    @IsEnum(District, { message: 'Either none or all of the fields: Citizenship Number, Issued From, Issued Date must be provided' })
    @ValidateIf((o) => (o.citizenshipNo?.length > 0 || o.issueDate?.length > 0))
    issuedFrom?: District;

    @ApiProperty({ type: Date })
    @IsDateString()
    @IsNotEmpty({ message: 'Either none or all of the fields: Citizenship Number, Issued From, Issued Date must be provided' })
    @ValidateIf((o) => (o.citizenshipNo?.length > 0 || o.issuedFrom?.length > 0))
    issueDate?: string;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Permanent Paper' })
    @IsOptional()
    permanentPaper?: FileSystemStoredFile;

    @ApiProperty({ type: String, description: 'Permanent Paper Type' })
    @IsOptional()
    permanentPaperType?: string
}

export class UpdatePatientDto extends PartialType(OmitType(CreatePatientDto, ['permanentPaper'])) {
    @ApiProperty({ type: 'string', format: 'binary', description: 'Permanent Paper' })
    @IsOptional()
    permanentPaper?: FileSystemStoredFile | string;
}