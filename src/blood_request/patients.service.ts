import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Patient } from "./entities/patient.entity";
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from "typeorm";
import { CreatePatientDto, UpdatePatientDto } from "./dto/create-patient.dto";
import paginatedData from "src/core/utils/paginatedData";
import { Deleted } from "src/core/dto/queryDto";
import { PatientQueryDto } from "./dto/patientQueryDto";
import getFileName from "src/core/utils/getImageUrl";
import { AddressService } from "src/address/address.service";
import { extractAddress } from "src/core/utils/extractAddress";

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
        private readonly addressService: AddressService
    ) { }

    async create(createPatientDto: CreatePatientDto) {
        const duplicatePatient = await this.patientRepo.findOne({
            where: [
                { inpatientNo: createPatientDto.inpatientNo },
                { contact: createPatientDto.contact },
            ]
        });

        if (duplicatePatient) throw new ConflictException('Duplicate Patient. Same inpatient no or contact already exists');

        const permanentPaper = createPatientDto.permanentPaper ? getFileName(createPatientDto.permanentPaper) : null;
        const address = await this.addressService.create(extractAddress(createPatientDto));

        return await this.patientRepo.save({
            ...createPatientDto,
            permanentPaper,
            address,
        });
    }

    async findAll(queryDto: PatientQueryDto) {
        const queryBuilder = this.patientRepo.createQueryBuilder('patient');
        const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

        queryBuilder
            .orderBy("patient.createdAt", queryDto.order)
            .skip(queryDto.search ? undefined : queryDto.skip)
            .take(queryDto.search ? undefined : queryDto.take)
            .leftJoinAndSelect('patient.address', 'address')
            .withDeleted()
            .where({ deletedAt })
            .andWhere(new Brackets(qb => {
                qb.where([
                    { patientName: ILike(`%${queryDto.search ?? ''}%`) },
                ])
                queryDto.bloodType && qb.andWhere({ bloodType: queryDto.bloodType })
                queryDto.rhFactor && qb.andWhere({ rhFactor: queryDto.rhFactor })
            }))

        return paginatedData(queryDto, queryBuilder);
    }

    async findOne(id: string) {
        const existing = await this.patientRepo.findOne({ where: { id }, relations: { address: true } });
        if (!existing) throw new BadRequestException('Patient not found');

        return existing;
    }

    async update(id: string, updatePatientDto: UpdatePatientDto) {
        const existing = await this.findOne(id);

        const duplicatePatient = await this.patientRepo.findOne({
            where: [
                { inpatientNo: updatePatientDto.inpatientNo },
                { contact: updatePatientDto.contact },
            ]
        });

        if (duplicatePatient.id !== existing.id) throw new ConflictException('Duplicate details. Same inpatient no or contact already exists');

        const permanentPaper = updatePatientDto.permanentPaper ? getFileName(updatePatientDto.permanentPaper) : existing.permanentPaper;
        updatePatientDto.country && await this.addressService.update(existing.address.id, extractAddress(updatePatientDto))


        Object.assign(existing, {
            ...updatePatientDto,
            permanentPaper,
        });

        return await this.patientRepo.save(existing);
    }

    async remove(ids: string[]) {
        const existingpatients = await this.patientRepo.find({
            where: {
                id: In(ids)
            }
        });
        await this.patientRepo.softRemove(existingpatients);

        return {
            success: true,
            message: 'patients removed',
        }
    }

    async restore(ids: string[]) {
        const existingpatients = await this.patientRepo.find({
            where: { id: In(ids) },
            withDeleted: true,
        })
        if (!existingpatients) throw new BadRequestException('patient not found');

        return await this.patientRepo.restore(ids);
    }

    async clearTrash() {
        return await this.patientRepo.delete({
            deletedAt: Not(IsNull())
        })
    }
}