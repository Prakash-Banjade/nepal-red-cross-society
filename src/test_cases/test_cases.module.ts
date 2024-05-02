import { Module } from '@nestjs/common';
import { TestCasesService } from './test_cases.service';
import { TestCasesController } from './test_cases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestCase } from './entities/test_case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestCase,])],
  controllers: [TestCasesController],
  providers: [TestCasesService],
})
export class TestCasesModule {}
