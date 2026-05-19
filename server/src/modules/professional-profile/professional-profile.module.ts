import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfessionalProfileController } from './presentation/http-server/controllers/professional-profile.controller';
import { ProfessionalProfileOrmEntity } from './persistence/postgres/entities/professional-profile.orm.entity';
import { ProfessionalProfileProviders } from './shared/providers';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([ProfessionalProfileOrmEntity]),
  ],
  providers: ProfessionalProfileProviders,
  controllers: [ProfessionalProfileController],
})
export class ProfessionalProfileModule {}
