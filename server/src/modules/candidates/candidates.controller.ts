import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../auth/core/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly service: CandidatesService) {}

  @Get()
  list() {
    return this.service.listCandidates();
  }

  @Post('evaluations')
  createEvaluation(
    @Request() req: any,
    @Body() body: { candidateUserId: string; rating: number; feedback: string; jobId?: string },
  ) {
    return this.service.createEvaluation(req.user.id, body.candidateUserId, body.rating, body.feedback, body.jobId);
  }

  @Get('my-evaluations')
  getMyEvaluations(@Request() req: any) {
    return this.service.getMyEvaluations(req.user.id);
  }

  @Get('evaluations/:candidateUserId')
  getEvaluations(@Param('candidateUserId') candidateUserId: string) {
    return this.service.getEvaluations(candidateUserId);
  }
}
