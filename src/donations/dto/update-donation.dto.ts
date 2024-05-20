import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDonationDto } from './create-donation.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {
    @ApiPropertyOptional({ type: String, isArray: true, example: ["High BP", "Sugar"] })
    @IsString({ each: true })
    @IsOptional()
    failedReason?: string[];

    @IsString()
    @IsOptional()
    verifiedBy: string;
}
