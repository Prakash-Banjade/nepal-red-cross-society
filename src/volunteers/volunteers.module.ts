import { Module } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { VolunteersController } from './volunteers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Volunteer,
    ])
  ],
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule {}
