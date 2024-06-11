import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { FileSystemStoredFile } from "nestjs-form-data";
import { Roles } from "src/core/types/global.types";

export class CreateUserDto {
    @ApiProperty({ type: 'string', description: 'First name must be at least 3 characters long' })
    @IsString()
    @IsNotEmpty()
    @Length(3)
    firstName: string;

    @ApiProperty({ type: 'string', description: 'Last name must be at least 2 characters long' })
    @IsString()
    @IsNotEmpty()
    @Length(2)
    lastName: string;

    @ApiProperty({ type: 'string', format: 'email', description: 'Valid email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: 'string', description: 'Password must be at least 8 characters long' })
    @IsString()
    @Length(8)
    password: string;

    @ApiPropertyOptional({ type: 'string', enum: Roles, description: 'User role', default: Roles.USER })
    @IsEnum(Roles, { message: 'Invalid role' })
    @IsOptional()
    role?: Roles = Roles.USER;

    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Profile Image' })
    @IsOptional()
    image?: FileSystemStoredFile
}
