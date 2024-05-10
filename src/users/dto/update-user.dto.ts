import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class UpdateUserDto {
    @ApiPropertyOptional({ type: 'string', description: 'firstName' })
    @IsString()
    @IsOptional()
    firstName: string;

    @ApiPropertyOptional({ type: 'string', description: 'lastName' })
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiPropertyOptional({ type: 'string', description: 'Email' })
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Profile Image' })
    @IsOptional()
    image: string | FileSystemStoredFile
}
