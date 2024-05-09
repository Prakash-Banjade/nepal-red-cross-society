import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDonationDto } from './create-donation.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {
    @ApiPropertyOptional({ type: String, format: 'uuid', example: '5c0f66b0-0d7a-11ed-861d-0242ac120002' })
    @IsUUID()
    @IsOptional()
    labReport?: string;

    @ApiPropertyOptional({ type: String, format: 'uuid', example: '5c0f66b0-0d7a-11ed-861d-0242ac120002' })
    @IsUUID()
    @IsOptional()
    certificate?: string;

    @ApiPropertyOptional({ type: String, isArray: true, example: ["High BP", "Sugar"] })
    @IsString({ each: true })
    @IsOptional()
    failedReason?: string[];

    @IsString()
    @IsOptional()
    verifiedBy: string;
}
