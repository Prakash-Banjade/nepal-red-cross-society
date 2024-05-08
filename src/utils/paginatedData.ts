import { PageDto } from "src/dto/page.dto.";
import { PageMetaDto } from "src/dto/pageMeta.dto";
import { PageOptionsDto } from "src/dto/pageOptions.dto";
import { SelectQueryBuilder } from "typeorm";

export default async function paginatedData<T>(
    pageOptionsDto: PageOptionsDto,
    queryBuilder: SelectQueryBuilder<T>
) {
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
}