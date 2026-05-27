import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalProfileOrmEntity } from '../professional-profile/persistence/postgres/entities/professional-profile.orm.entity';
import { UserOrmEntity } from '../auth/persistence/postgres/entities/user.orm.entity';
import { DiagnosisResultOrmEntity } from '../diagnosis/persistence/postgres/entities/diagnosis-result.orm.entity';
import { CandidateEvaluationOrmEntity } from './persistence/candidate-evaluation.orm.entity';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfessionalProfileOrmEntity,
      UserOrmEntity,
      DiagnosisResultOrmEntity,
      CandidateEvaluationOrmEntity,
    ]),
    AuthModule,
    NotificationsModule,
  ],
  providers: [CandidatesService],
  controllers: [CandidatesController],
})
export class CandidatesModule {}
