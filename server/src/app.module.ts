import { Module } from '@nestjs/common';
import { CompanyMarketplaceModule } from './modules/company-marketplace/company-marketplace.module';
import { ProfessionalProfileModule } from './modules/professional-profile/professional-profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CompanyMarketplaceModule,
    ProfessionalProfileModule,
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
