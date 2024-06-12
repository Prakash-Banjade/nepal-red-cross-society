import { Module } from '@nestjs/common';
import { BagTypesService } from './bag-types.service';
import { BagTypesController } from './bag-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BagType } from './entities/bag-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BagType,
    ])
  ],
  controllers: [BagTypesController],
  providers: [BagTypesService],
  exports: [BagTypesService],
})
export class BagTypesModule { }
