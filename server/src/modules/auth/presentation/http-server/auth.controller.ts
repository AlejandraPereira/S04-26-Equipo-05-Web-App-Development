import { Body, Controller, Get, Patch, Post, UseGuards, Request, Res } from '@nestjs/common';
import { UserRole } from '../../persistence/postgres/entities/user.orm.entity';
import { Response } from 'express';
import { AuthService } from '../../core/services/auth.service';
import { RegisterDto } from '../../core/dtos/register.dto';
import { LoginDto } from '../../core/dtos/login.dto';
import { ForgotPasswordDto } from '../../core/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../../core/dtos/reset-password.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../../core/guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto & { expectedRole?: string }) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return this.authService.getMe(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Request() req: any, @Body() body: { fullName?: string }) {
    return this.authService.updateMe(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('role')
  updateRole(@Request() req: any, @Body() body: { role: UserRole }) {
    return this.authService.updateRole(req.user.id, body.role);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req: any, @Res() res: Response) {
    const result = await this.authService.loginWithGoogle(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (result.isNew) {
      return res.redirect(`${frontendUrl}/select-role?token=${result.token}`);
    }

    const redirect = result.user.role === 'empresa' ? '/companyprofile' : '/dashboard';
    res.redirect(`${frontendUrl}/auth/callback?token=${result.token}&redirect=${redirect}`);
  }
}
