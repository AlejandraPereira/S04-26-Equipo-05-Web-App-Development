import { Module } from '@nestjs/common';
import { CompanyMarketplaceModule } from './modules/company-marketplace/company-marketplace.module';
import { ProfessionalProfileModule } from './modules/professional-profile/professional-profile.module';
import { AuthModule } from './modules/auth/auth.module';
import { DiagnosisModule } from './modules/diagnosis/diagnosis.module';
import { LearningModule } from './modules/learning/learning.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    DiagnosisModule,
    LearningModule,
    CandidatesModule,
    CompanyMarketplaceModule,
    ProfessionalProfileModule,
    NotificationsModule,
    ConfigModule.forRoot(),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
