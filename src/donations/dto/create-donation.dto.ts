import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { DonationStatus, DonationType } from "src/core/types/fieldsEnum.types";

export class CreateDonationDto {
    @ApiProperty({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    donor: string;

    @ApiProperty({ type: 'number' })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Blood bag no. must be number');
        return parseInt(value);
    })
    bloodBagNo: number;

    @ApiPropertyOptional({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @ValidateIf(o => o.donationType === DonationType.ORGANIZATION)
    donation_event?: string;

    @ApiProperty({ type: 'enum', enum: DonationType })
    @IsEnum(DonationType, { message: 'Donation type must be one of these: ' + Object.values(DonationType) })
    @IsNotEmpty()
    donationType: DonationType

    @ApiPropertyOptional({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @ValidateIf(o => o.donationType === DonationType.ORGANIZATION)
    bagType?: string;

    // @ApiPropertyOptional({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
    // @IsUUID()
    // @IsOptional()
    // @ValidateIf(o => o.donationType === DonationType.ORGANIZATION)
    // organization?: string;
}
