import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDonationDto } from './create-donation.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DonationStatus } from 'src/core/types/fieldsEnum.types';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {
    @ApiPropertyOptional({ type: String, isArray: true, example: ["High BP", "Sugar"] })
    @IsString({ each: true })
    @IsOptional()
    failedReason?: string[];
    
    @ApiPropertyOptional({ enum: DonationStatus, default: DonationStatus.PENDING, description: 'Default status will be PENDING' })
    @IsEnum(DonationStatus, { message: 'Donation status must be one of these: ' + Object.values(DonationStatus) })
    @IsOptional()
    status?: DonationStatus;

    @ApiPropertyOptional({ type: String })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    verifiedBy?: string;
}
