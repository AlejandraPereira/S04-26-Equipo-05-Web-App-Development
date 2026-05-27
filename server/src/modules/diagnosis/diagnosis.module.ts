import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosisResultOrmEntity } from './persistence/postgres/entities/diagnosis-result.orm.entity';
import { DiagnosisService } from './core/services/diagnosis.service';
import { DiagnosisController } from './presentation/http-server/diagnosis.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosisResultOrmEntity]), AuthModule],
  providers: [DiagnosisService],
  controllers: [DiagnosisController],
})
export class DiagnosisModule {}
