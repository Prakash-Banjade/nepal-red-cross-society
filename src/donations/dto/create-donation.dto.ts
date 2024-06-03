import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { DonationStatus, DonationType } from "src/core/types/global.types";

export class CreateDonationDto {
    @ApiProperty({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    donor: string;

    @ApiPropertyOptional({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    donation_event?: string;

    @ApiProperty({ type: 'enum', enum: DonationType })
    @IsEnum(DonationType, { message: 'Donation type must be one of these: ' + Object.values(DonationType) })
    @IsNotEmpty()
    donationType: DonationType

    @ApiPropertyOptional({ type: String, format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsOptional()
    organization?: string;

    @ApiProperty({ description: 'Blood bag number' })
    @IsString()
    @IsNotEmpty()
    bloodBagNo: string;

    @ApiPropertyOptional({ enum: DonationStatus, default: DonationStatus.PENDING, description: 'Default status will be PENDING' })
    @IsEnum(DonationStatus, { message: 'Donation status must be one of these: ' + Object.values(DonationStatus) })
    @IsOptional()
    status?: DonationStatus;

    @ApiPropertyOptional({ type: String })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    verifiedBy: string;
}
