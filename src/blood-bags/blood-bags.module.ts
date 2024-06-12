import { forwardRef, Module } from '@nestjs/common';
import { BloodBagsService } from './blood-bags.service';
import { BloodBagsController } from './blood-bags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodBag } from './entities/blood-bag.entity';
import { InventoryModule } from 'src/inventory/inventory.module';
import { BagTypesModule } from 'src/bag-types/bag-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodBag,
    ]),
    forwardRef(() => InventoryModule),
    BagTypesModule,
  ],
  controllers: [BloodBagsController],
  providers: [BloodBagsService],
  exports: [BloodBagsService]
})
export class BloodBagsModule { }
