import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDonorDto } from './create-donor.dto';

export class UpdateDonorDto extends PartialType(OmitType(CreateDonorDto, ['password'] as const)) { }
