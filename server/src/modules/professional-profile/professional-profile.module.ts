import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { ProfessionalProfileController } from './presentation/http-server/controllers/professional-profile.controller';
import { WorkExperienceController } from './presentation/http-server/controllers/work-experience.controller';
import { ProfessionalProfileOrmEntity } from './persistence/postgres/entities/professional-profile.orm.entity';
import { UserOrmEntity } from '../auth/persistence/postgres/entities/user.orm.entity';
import { ProfessionalProfileProviders } from './shared/providers';
import { WorkExperienceService } from './core/services/work-experience.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProfessionalProfileOrmEntity, UserOrmEntity]),
    AuthModule,
  ],
  providers: [...ProfessionalProfileProviders, WorkExperienceService],
  controllers: [ProfessionalProfileController, WorkExperienceController],
})
export class ProfessionalProfileModule {}
