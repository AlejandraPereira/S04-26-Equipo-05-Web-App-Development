import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/core/guards/jwt-auth.guard';
import { JobApplicationService } from '../../../core/services/job-application.service';
import { ApplicationStatus } from '../../../persistence/postgres/entities/job-application.orm.entity';

@UseGuards(JwtAuthGuard)
@Controller('job-applications')
export class JobApplicationController {
  constructor(private readonly service: JobApplicationService) {}

  @Post(':jobId/apply')
  apply(
    @Request() req: any,
    @Param('jobId') jobId: string,
    @Body() body: { coverLetter?: string },
  ) {
    return this.service.apply(req.user.id, jobId, body.coverLetter);
  }

  @Get('mine')
  getMyApplications(@Request() req: any) {
    return this.service.getMyApplications(req.user.id);
  }

  @Get('job/:jobId')
  getApplicationsForJob(@Param('jobId') jobId: string) {
    return this.service.getApplicationsForJob(jobId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus },
  ) {
    return this.service.updateStatus(id, body.status);
  }

  @Get('applied-ids')
  async getAppliedJobIds(@Request() req: any) {
    return this.service.getAppliedJobIds(req.user.id);
  }

  @Get('company-stats')
  async getCompanyStats(@Request() req: any) {
    return this.service.getCompanyStats(req.user.id);
  }
}
