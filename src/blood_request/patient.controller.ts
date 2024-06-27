import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PatientsService } from "./patients.service";
import { Throttle } from "@nestjs/throttler";
import { TransactionInterceptor } from "src/core/interceptors/transaction.interceptor";
import { FileSystemStoredFile, FormDataRequest } from "nestjs-form-data";
import { ChekcAbilities } from "src/core/decorators/abilities.decorator";
import { Action } from "src/core/types/global.types";
import { CreatePatientDto, UpdatePatientDto } from "./dto/create-patient.dto";
import { ApiPaginatedResponse } from "src/core/decorators/apiPaginatedResponse.decorator";
import { QueryDto } from "src/core/dto/queryDto";
import { PatientQueryDto } from "./dto/patientQueryDto";

@ApiTags('Patient')
@Controller('patients')
export class PatientController {
    constructor(private readonly patientService: PatientsService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @Throttle({ default: { limit: 5, ttl: 20000 } })
    @UseInterceptors(TransactionInterceptor)
    @FormDataRequest({ storage: FileSystemStoredFile })
    @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
    create(@Body() createBloodRequestDto: CreatePatientDto) {
        return this.patientService.create(createBloodRequestDto);
    }

    @Get()
    @ApiPaginatedResponse(CreatePatientDto)
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findAll(@Query() queryDto: PatientQueryDto) {
        return this.patientService.findAll(queryDto);
    }

    @Get(':id')
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findOne(@Param('id') id: string) {
        return this.patientService.findOne(id);
    }

    @Patch(':id')
    @ApiConsumes('multipart/form-data')
    @Throttle({ default: { limit: 1, ttl: 2000 } })
    @UseInterceptors(TransactionInterceptor)
    @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
    @FormDataRequest({ storage: FileSystemStoredFile })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePatientDto: UpdatePatientDto) {
        return this.patientService.update(id, updatePatientDto);
    }

    @Post('deleteMany')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    remove(@Body('ids') ids: string) {
        return this.patientService.remove(JSON.parse(ids));
    }

    @Post('restoreMany')
    @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
    @HttpCode(HttpStatus.OK)
    restore(@Body('ids') ids: string) {
        return this.patientService.restore(JSON.parse(ids));
    }

    @Post('emptyTrash')
    @HttpCode(HttpStatus.OK)
    @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    emptyTrash() {
        return this.patientService.clearTrash();
    }
}