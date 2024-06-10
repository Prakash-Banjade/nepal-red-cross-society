import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
  ) { }

  async create(createBranchDto: CreateBranchDto) {
    const existingBranchWithSameName = await this.branchRepo.findOneBy({ name: createBranchDto.name });
    if (existingBranchWithSameName) return new BadRequestException('Branch with same name already exists');

    const branch = this.branchRepo.create(createBranchDto);
    return await this.branchRepo.save(branch);
  }

  async findAll() {
    return await this.branchRepo.find();
  }

  async findOne(id: string) {
    const existingBranch = await this.branchRepo.findOne({
      where: { id },
    })

    if (!existingBranch) throw new BadRequestException('Branch not found');

    return existingBranch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const existingBranch = await this.findOne(id);

    Object.assign(existingBranch, updateBranchDto);

    return await this.branchRepo.save(existingBranch);
  }

  async remove(id: string) {
    const existingBranch = await this.findOne(id);
    return await this.branchRepo.remove(existingBranch);
  }
}
