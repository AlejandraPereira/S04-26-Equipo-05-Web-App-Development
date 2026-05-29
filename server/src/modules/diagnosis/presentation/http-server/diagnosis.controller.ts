import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { DiagnosisService } from '../../core/services/diagnosis.service';
import { SubmitDiagnosisDto } from '../../core/dtos/submit-diagnosis.dto';
import { JwtAuthGuard } from '../../../auth/core/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly service: DiagnosisService) {}

  @Post('submit')
  submit(@Request() req: any, @Body() dto: SubmitDiagnosisDto) {
    return this.service.submit(req.user.id, dto);
  }

  @Get('result')
  getResult(@Request() req: any) {
    return this.service.getLatestResult(req.user.id);
  }
}
