import { forwardRef, Module } from '@nestjs/common';
import { BloodBagsService } from './blood-bags.service';
import { BloodBagsController } from './blood-bags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodBag } from './entities/blood-bag.entity';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BloodBag,
    ]),
    forwardRef(() => InventoryModule),
  ],
  controllers: [BloodBagsController],
  providers: [BloodBagsService],
  exports: [BloodBagsService]
})
export class BloodBagsModule { }
