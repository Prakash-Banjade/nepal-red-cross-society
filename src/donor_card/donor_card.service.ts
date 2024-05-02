import { Injectable } from '@nestjs/common';
import { CreateDonorCardDto } from './dto/create-donor_card.dto';
import { UpdateDonorCardDto } from './dto/update-donor_card.dto';

@Injectable()
export class DonorCardService {
  create(createDonorCardDto: CreateDonorCardDto) {
    return 'This action adds a new donorCard';
  }

  findAll() {
    return `This action returns all donorCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donorCard`;
  }

  update(id: number, updateDonorCardDto: UpdateDonorCardDto) {
    return `This action updates a #${id} donorCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} donorCard`;
  }
}
