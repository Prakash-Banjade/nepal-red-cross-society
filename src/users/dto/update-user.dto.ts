import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }
