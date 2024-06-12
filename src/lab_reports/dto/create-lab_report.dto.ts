import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsDefined, IsEnum, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, IsUUID } from "class-validator";
import { BloodType, RhFactor, TestCaseStatus } from "src/core/types/fieldsEnum.types";

class TestCase {
    @ApiProperty({ format: 'uuidv4' })
    @IsUUID()
    @IsNotEmpty()
    testCase: string;

    @ApiProperty({ type: 'string', description: 'Obtained result' })
    @IsString()
    @IsNotEmpty()
    obtainedResult: string;

    @ApiProperty({ type: 'enum', enum: TestCaseStatus, description: 'Test Case Status' })
    @IsEnum(TestCaseStatus)
    @IsNotEmpty()
    status: TestCaseStatus;
}

class Component {
    @ApiProperty({ type: 'string' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (isNaN(parseInt(value))) throw new BadRequestException('Expiry in days must be a number');
        return parseInt(value);
    })
    expiryInDays: number;
}

export class CreateLabReportDto {
    @ApiProperty({ format: 'date-time' })
    @IsNotEmpty()
    date: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    issuedBy: string;

    @ApiProperty({ type: 'enum', enum: BloodType, description: 'Donor blood type' })
    @IsEnum(BloodType, { message: 'Invalid blood type. Blood type must be either ' + Object.values(BloodType).join(', ') })
    bloodType!: BloodType;

    @ApiProperty({ type: 'enum', enum: RhFactor, description: 'Donor blood RH-factor' })
    @IsEnum(RhFactor, { message: 'Invalid rh factor. Rh factor must be either ' + Object.values(RhFactor).join(', ') })
    rhFactor!: RhFactor;

    @ApiProperty({ format: 'uuidv4' })
    @IsUUID()
    @IsNotEmpty()
    donation: string;

    @ApiProperty({ isArray: true, description: 'Array of test case ids' })
    @IsDefined()
    @Type(() => TestCase)
    testCases: TestCase[];

    @ApiProperty({ isArray: true, description: 'Array of components' })
    @IsDefined()
    @Type(() => Component)
    components: Component[];
}
