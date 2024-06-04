import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { PageMetaDto } from "./pageMeta.dto";


export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  @ApiProperty({ type: () => Object })
  readonly additionalData?: any = {}

  constructor(data: T[], meta: PageMetaDto, additionalData?: any) {
    this.data = data;
    this.meta = meta;
    this.additionalData = additionalData
  }
}