import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";

export class ImageDto_Optional {
    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsOptional()
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for cover image. Cover image must be a jpeg or png' })
    @IsFile({ message: 'Invalid type for cover image. Cover image must be a file' })
    image?: FileSystemStoredFile | string;
}

export class ImageDto_Required {
    @ApiProperty({ type: 'string', format: 'binary' })
    @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { message: 'Invalid type for cover image. Cover image must be a jpeg or png' })
    @IsFile({ message: 'Invalid type for cover image. Cover image must be a file' })
    image!: FileSystemStoredFile;
}