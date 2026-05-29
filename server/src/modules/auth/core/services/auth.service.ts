import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserOrmEntity, UserRole } from '../../persistence/postgres/entities/user.orm.entity';
import { PasswordResetTokenOrmEntity } from '../../persistence/postgres/entities/password-reset-token.orm.entity';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    @InjectRepository(PasswordResetTokenOrmEntity)
    private readonly resetTokenRepo: Repository<PasswordResetTokenOrmEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('El email ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      id: uuidv4(),
      email: dto.email,
      fullName: dto.fullName,
      role: dto.role,
      passwordHash,
    });
    await this.userRepo.save(user);
    return this.buildResponse(user);
  }

  async login(dto: LoginDto & { expectedRole?: string }) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    if (dto.expectedRole && user.role !== dto.expectedRole) {
      throw new UnauthorizedException(
        dto.expectedRole === 'empresa'
          ? 'Esta cuenta no es de empresa. Iniciá sesión como Profesional.'
          : 'Esta cuenta es de empresa. Iniciá sesión como Empresa.',
      );
    }

    return this.buildResponse(user);
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return this.toPublic(user);
  }

  async updateMe(userId: string, dto: { fullName?: string }) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    if (dto.fullName) user.fullName = dto.fullName;
    await this.userRepo.save(user);
    return this.toPublic(user);
  }

  async updateRole(userId: string, role: UserRole) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    user.role = role;
    await this.userRepo.save(user);
    return this.buildResponse(user);
  }

  async loginWithGoogle(googleUser: { email: string; fullName: string }) {
    let user = await this.userRepo.findOneBy({ email: googleUser.email });
    let isNew = false;

    if (!user) {
      isNew = true;
      const passwordHash = await bcrypt.hash(uuidv4(), 10);
      user = this.userRepo.create({
        id: uuidv4(),
        email: googleUser.email,
        fullName: googleUser.fullName,
        role: 'profesional' as any,
        passwordHash,
      });
      await this.userRepo.save(user);
    }

    return { ...this.buildResponse(user), isNew };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    // Responder siempre igual para no revelar si el email existe
    if (!user) return { message: 'Si el email existe, recibirás un enlace de recuperación.' };

    // Invalidar tokens anteriores del mismo usuario
    await this.resetTokenRepo.delete({ userId: user.id, used: false });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.resetTokenRepo.save(
      this.resetTokenRepo.create({ id: uuidv4(), userId: user.id, token, expiresAt }),
    );

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailService.sendPasswordReset(user.email, resetUrl);

    return { message: 'Si el email existe, recibirás un enlace de recuperación.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.resetTokenRepo.findOneBy({ token: dto.token, used: false });
    if (!record) throw new NotFoundException('Token inválido o ya utilizado');

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('El enlace de recuperación expiró. Solicitá uno nuevo.');
    }

    const user = await this.userRepo.findOneBy({ id: record.userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    record.used = true;
    await this.resetTokenRepo.save(record);

    return { message: 'Contraseña actualizada correctamente.' };
  }

  private buildResponse(user: UserOrmEntity) {
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { token, user: this.toPublic(user) };
  }

  private toPublic(user: UserOrmEntity) {
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role, createdAt: user.createdAt };
  }
}
