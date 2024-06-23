import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "./entities/patient.entity";
import { Brackets, ILike, IsNull, Not, Or, Repository } from "typeorm";
import { CreatePatientDto } from "./dto/create-patient.dto";
import paginatedData from "src/core/utils/paginatedData";
import { Deleted, QueryDto } from "src/core/dto/queryDto";

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    ) { }

    async create(createPatientDto: CreatePatientDto) {
        const patientWithSameInPatientNo = await this.patientRepo.findOne({
            where: { inpatientNo: createPatientDto.inpatientNo }
        });

        if (patientWithSameInPatientNo) throw new ConflictException('Patient with same inpatient no already exists');

        return this.patientRepo.save(createPatientDto);
    }

    async findAll(queryDto: QueryDto) {
        const queryBuilder = this.patientRepo.createQueryBuilder('patient');
        const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

        queryBuilder
            .orderBy("patient.createdAt", queryDto.order)
            .skip(queryDto.search ? undefined : queryDto.skip)
            .take(queryDto.search ? undefined : queryDto.take)
            .withDeleted()
            .where({ deletedAt })
            .andWhere(new Brackets(qb => {
                qb.where([
                    { patientName: ILike(`%${queryDto.search ?? ''}%`) },
                ])
            }))

        return paginatedData(queryDto, queryBuilder);
    }

    async findOne(id: string) {
        const existing = this.patientRepo.findOne({ where: { id } });
        if (!existing) throw new BadRequestException('Patient not found');

        return existing;
    }
}