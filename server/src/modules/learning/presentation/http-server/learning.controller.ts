import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { LearningService } from '../../core/services/learning.service';
import { UpdateProgressDto } from '../../core/dtos/update-progress.dto';
import { JwtAuthGuard } from '../../../auth/core/guards/jwt-auth.guard';

@Controller('learning')
export class LearningController {
  constructor(private readonly service: LearningService) {}

  @Get('courses')
  getCourses() {
    return this.service.getCourses();
  }

  @Get('courses/:id')
  getCourse(@Param('id') id: string) {
    return this.service.getCourse(id);
  }

  @Get('courses/:id/quiz')
  getQuiz(@Param('id') id: string) {
    return this.service.getQuiz(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-courses')
  getMyCoursesWithProgress(@Request() req: any) {
    return this.service.getCoursesWithProgress(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  getProgress(@Request() req: any) {
    return this.service.getUserProgress(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('progress/:courseId')
  updateProgress(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.service.updateProgress(req.user.id, courseId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('courses/:courseId/lesson/:lessonIndex')
  completeLesson(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('lessonIndex') lessonIndex: string,
  ) {
    return this.service.completeLesson(req.user.id, courseId, parseInt(lessonIndex));
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses/:courseId/quiz/result')
  saveQuizResult(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Body() body: { score: number; passed: boolean; correctCount: number; totalQuestions: number },
  ) {
    return this.service.saveQuizResult(req.user.id, courseId, body.score, body.passed, body.correctCount, body.totalQuestions);
  }

  @UseGuards(JwtAuthGuard)
  @Get('quiz-results/mine')
  getMyQuizResults(@Request() req: any) {
    return this.service.getMyQuizResults(req.user.id);
  }
}
