import { PartialType } from '@nestjs/swagger';
import { CreateBloodBagDto } from './create-blood-bag.dto';

export class UpdateBloodBagDto extends PartialType(CreateBloodBagDto) {}
