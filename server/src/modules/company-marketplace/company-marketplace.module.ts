import { Module } from '@nestjs/common';
import { CompanyController } from './presentation/http-server/controllers/company.controller';
import { JobController } from './presentation/http-server/controllers/job.controller';
import { CompanyMarketplaceProviders } from './shared/providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompanyOrmEntity } from './persistence/postgres/entities/company.orm.entity';
import { JobOpportunityOrmEntity } from './persistence/postgres/entities/job-opportunity.orm.entity';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([CompanyOrmEntity, JobOpportunityOrmEntity]),
  ],
  providers: CompanyMarketplaceProviders,
  controllers: [CompanyController, JobController],
})
export class CompanyMarketplaceModule {}
