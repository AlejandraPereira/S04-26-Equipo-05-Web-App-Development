import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseOrmEntity } from './persistence/postgres/entities/course.orm.entity';
import { UserProgressOrmEntity } from './persistence/postgres/entities/user-progress.orm.entity';
import { QuizResultOrmEntity } from './persistence/postgres/entities/quiz-result.orm.entity';
import { LearningService } from './core/services/learning.service';
import { LearningController } from './presentation/http-server/learning.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseOrmEntity, UserProgressOrmEntity, QuizResultOrmEntity]),
    AuthModule,
  ],
  providers: [LearningService],
  controllers: [LearningController],
})
export class LearningModule {}
