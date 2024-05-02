import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Repository } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';

@Injectable()
export class CertificateService {

  constructor(
    @InjectRepository(Certificate) private certificateRepo: Repository<Certificate>,
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
  ) { }

  async create(createCertificateDto: CreateCertificateDto) {
    const certificate = this.certificateRepo.create(createCertificateDto);
    return this.certificateRepo.save(certificate);
  }

  async findAll() {
    return this.certificateRepo.find();
  }

  async findOne(id: string) {
    const foundCertificate = await this.certificateRepo.findOneBy({ id });
    if (!foundCertificate) throw new NotFoundException('Certificate not found');

    return foundCertificate;
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    const foundCertificate = await this.findOne(id);

    // retrieving donation
    const donation = updateCertificateDto.donation ? await this.donationRepo.findOneBy({ id: updateCertificateDto.donation }) : null;

    Object.assign(foundCertificate, {
      ...updateCertificateDto,
      donation,
    })

    return await this.certificateRepo.save(foundCertificate);
  }

  async remove(id: string) {
    const foundCertificate = await this.findOne(id);
    return await this.certificateRepo.softRemove(foundCertificate);
  }
}
