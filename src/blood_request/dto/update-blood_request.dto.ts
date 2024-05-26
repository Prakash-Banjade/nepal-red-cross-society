import { PartialType } from '@nestjs/swagger';
import { CreateBloodRequestDto } from './create-blood_request.dto';

export class UpdateBloodRequestDto extends PartialType(CreateBloodRequestDto) {}
