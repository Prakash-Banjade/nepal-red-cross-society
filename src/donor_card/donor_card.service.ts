import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonorCardDto } from './dto/create-donor_card.dto';
import { UpdateDonorCardDto } from './dto/update-donor_card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DonorCard } from './entities/donor_card.entity';
import { In, Repository } from 'typeorm';
import { Donor } from 'src/donors/entities/donor.entity';

@Injectable()
export class DonorCardService {
  constructor(
    @InjectRepository(DonorCard) private donorCardRepo: Repository<DonorCard>,
    @InjectRepository(Donor) private donorRepo: Repository<Donor>,
  ) { }

  async create(createDonorCardDto: CreateDonorCardDto) {
    const donor = await this.findDonor(createDonorCardDto.donor);

    const existingCard = await this.donorCardRepo.findOneBy({ card_no: createDonorCardDto.card_no });
    if (existingCard) throw new BadRequestException('Card already exists');

    const createdDonorCard = this.donorCardRepo.create({
      ...createDonorCardDto,
      donor,
    });

    return await this.donorCardRepo.save(createdDonorCard);
  }

  async findAll() {
    return await this.donorCardRepo.find({});
  }

  async findOne(id: string) {
    const existingCard = await this.donorCardRepo.findOneBy({ id });
    if (!existingCard) throw new BadRequestException('Card not found');

    return existingCard;
  }

  async update(id: string, updateDonorCardDto: UpdateDonorCardDto) {
    const existingCard = await this.findOne(id);

    const donor = await this.findDonor(updateDonorCardDto.donor);

    Object.assign(existingCard, {
      ...updateDonorCardDto,
      donor,
    })

    await this.donorCardRepo.save(existingCard);
  }

  async remove(ids: string[]) {
    const existingCards = await this.donorCardRepo.find({
      where: {
        id: In(ids)
      }
    });
    await this.donorCardRepo.softRemove(existingCards);

    return {
      success: true,
      message: 'Cards removed',
    }
  }

  async findDonor(id: string): Promise<Donor> {
    const donor = await this.donorRepo.findOneBy({ id });
    if (!donor) throw new BadRequestException('Donor not found');

    // checking if eligible
    if (donor.donations?.length < 3) throw new BadRequestException('Donor must have atleast 3 donations');

    return donor;
  }
}
