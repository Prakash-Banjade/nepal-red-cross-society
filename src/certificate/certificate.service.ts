import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import { PageOptionsDto } from 'src/core/dto/pageOptions.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class CertificateService {

  constructor(
    @InjectRepository(Certificate) private certificateRepo: Repository<Certificate>,
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
  ) { }

  async create(createCertificateDto: CreateCertificateDto) {
    const donation = await this.findDonation(createCertificateDto.donation);

    const certificate = this.certificateRepo.create({
      ...createCertificateDto,
      donation,
    });

    return await this.certificateRepo.save(certificate);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    this.queryBuilder()
      .orderBy("certificate.createdAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)

    return paginatedData(pageOptionsDto, this.queryBuilder())
  }

  async findOne(id: string) {
    const foundCertificate = await this.certificateRepo.findOneBy({ id });
    if (!foundCertificate) throw new NotFoundException('Certificate not found');

    return foundCertificate;
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    const foundCertificate = await this.findOne(id);

    // retrieving donation
    const donation = updateCertificateDto?.donation ? await this.findDonation(updateCertificateDto.donation) : null;

    Object.assign(foundCertificate, {
      ...updateCertificateDto,
      donation,
    })

    return await this.certificateRepo.save(foundCertificate);
  }

  async remove(ids: string[]) {
    const foundCertificates = await this.certificateRepo.find({
      where: {
        id: In(ids),
      }
    })

    await this.certificateRepo.softRemove(foundCertificates);
    
    return {
      success: true,
      message: 'Certificates deleted successfully',
    }
  }

  // To avoid circular dependency, we need to retrieve donation in this service too
  async findDonation(id: string) {
    const foundDonation = await this.donationRepo.findOneBy({ id });
    if (!foundDonation) throw new BadRequestException('Donation not found');

    return foundDonation;
  }

  private queryBuilder(): SelectQueryBuilder<Certificate> {
    return this.certificateRepo.createQueryBuilder("certificate")
  }
}
