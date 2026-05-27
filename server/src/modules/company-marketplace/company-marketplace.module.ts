import { Module } from '@nestjs/common';
import { CompanyController } from './presentation/http-server/controllers/company.controller';
import { JobController } from './presentation/http-server/controllers/job.controller';
import { JobApplicationController } from './presentation/http-server/controllers/job-application.controller';
import { CompanyMarketplaceProviders } from './shared/providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyOrmEntity } from './persistence/postgres/entities/company.orm.entity';
import { JobOpportunityOrmEntity } from './persistence/postgres/entities/job-opportunity.orm.entity';
import { JobApplicationOrmEntity } from './persistence/postgres/entities/job-application.orm.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { CompanyDirectService } from './core/services/company-direct.service';
import { JobApplicationService } from './core/services/job-application.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserOrmEntity } from '../auth/persistence/postgres/entities/user.orm.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      CompanyOrmEntity,
      JobOpportunityOrmEntity,
      JobApplicationOrmEntity,
      UserOrmEntity,
    ]),
    AuthModule,
    NotificationsModule,
  ],
  providers: [...CompanyMarketplaceProviders, CompanyDirectService, JobApplicationService],
  controllers: [CompanyController, JobController, JobApplicationController],
})
export class CompanyMarketplaceModule {}
