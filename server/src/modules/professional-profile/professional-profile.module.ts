import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfessionalProfileController } from './presentation/http-server/controllers/professional-profile.controller';
import { ProfessionalProfileOrmEntity } from './persistence/postgres/entities/professional-profile.orm.entity';
import { ProfessionalProfileProviders } from './shared/providers';

@Module({
  imports: [
    CqrsModule,
    // Moises: Las conexion a base datos las subi al modulo principal, por lo que ahora podemos utilizar 
    // esa conexion global en toda la app, ya no es necesario tener conexion por modulo, cuando leas esto,
    // confirma nada mas felipe y puedes eliminar este comentario. saludos :)...
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     url: configService.get<string>('DATABASE_URL'),
    //     autoLoadEntities: true,
    //     synchronize: true,
    //   }),
    // }),

    TypeOrmModule.forFeature([ProfessionalProfileOrmEntity]),
  ],
  providers: ProfessionalProfileProviders,
  controllers: [ProfessionalProfileController],
})
export class ProfessionalProfileModule {}
