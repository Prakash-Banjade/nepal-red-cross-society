import { PartialType } from '@nestjs/swagger';
import { CreateBloodInventoryDto } from './create-blood_inventory.dto';

export class UpdateBloodInventoryDto extends PartialType(CreateBloodInventoryDto) {}
