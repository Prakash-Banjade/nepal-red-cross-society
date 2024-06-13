import { Global, Module } from '@nestjs/common';
import { BagTypesService } from './bag-types.service';
import { BagTypesController } from './bag-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BagType } from './entities/bag-type.entity';
import { BloodComponent } from './entities/blood-component.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BagType,
      BloodComponent,
    ])
  ],
  controllers: [BagTypesController],
  providers: [BagTypesService],
  exports: [BagTypesService],
})
export class BagTypesModule { }
