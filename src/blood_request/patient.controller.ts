import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PatientsService } from "./patients.service";
import { Throttle } from "@nestjs/throttler";
import { TransactionInterceptor } from "src/core/interceptors/transaction.interceptor";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { Action } from "src/core/types/global.types";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { ApiPaginatedResponse } from "src/core/decorators/apiPaginatedResponse.decorator";
import { QueryDto } from "src/core/dto/queryDto";

@ApiTags('Patient')
@Controller('patients')
export class PatientController {
    constructor(private readonly patientService: PatientsService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseInterceptors(TransactionInterceptor)
    @FormDataRequest({ storage: FileSystemStoredFile })
    @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
    create(@Body() createBloodRequestDto: CreatePatientDto) {
        return this.patientService.create(createBloodRequestDto);
    }

    @Get()
    @ApiPaginatedResponse(CreatePatientDto)
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findAll(@Query() queryDto: QueryDto) {
        return this.patientService.findAll(queryDto);
    }

    @Get(':id')
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findOne(@Param('id') id: string) {
        return this.patientService.findOne(id);
    }
}