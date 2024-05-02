import { PartialType } from '@nestjs/swagger';
import { CreateDonationEventDto } from './create-donation_event.dto';

export class UpdateDonationEventDto extends PartialType(CreateDonationEventDto) {}
