import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/core/guards/jwt-auth.guard';
import { WorkExperienceService } from '../../../core/services/work-experience.service';

@Controller('professional-profile')
export class WorkExperienceController {
  constructor(private readonly service: WorkExperienceService) {}

  /** Public: no auth required — used by the shareable profile page */
  @Get('public/:userId')
  getPublicProfile(@Param('userId') userId: string) {
    return this.service.getPublicProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/work-experiences')
  getWorkExperiences(@Param('userId') userId: string) {
    return this.service.getWorkExperiences(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId/work-experiences')
  saveWorkExperiences(
    @Param('userId') userId: string,
    @Body() body: { workExperiences: any[] },
  ) {
    return this.service.saveWorkExperiences(userId, body.workExperiences ?? []);
  }
}
