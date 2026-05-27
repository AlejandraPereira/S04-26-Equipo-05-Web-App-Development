import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from './persistence/postgres/entities/user.orm.entity';
import { PasswordResetTokenOrmEntity } from './persistence/postgres/entities/password-reset-token.orm.entity';
import { AuthService } from './core/services/auth.service';
import { MailService } from './core/services/mail.service';
import { JwtStrategy } from './core/strategies/jwt.strategy';
import { GoogleStrategy } from './core/strategies/google.strategy';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { GoogleAuthGuard } from './core/guards/google-auth.guard';
import { AuthController } from './presentation/http-server/auth.controller';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([UserOrmEntity, PasswordResetTokenOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' as const },
      }),
    }),
  ],
  providers: [AuthService, MailService, JwtStrategy, GoogleStrategy, JwtAuthGuard, GoogleAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
