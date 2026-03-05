import { Controller, Get, Post, Param, UseGuards, Request, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('my-progress')
  getMyProgress(@Request() req) {
    return this.progressService.getMyProgress(req.user.id);
  }

  @Get('lesson/:lessonId')
  getLessonProgress(@Request() req, @Param('lessonId') lessonId: string) {
    return this.progressService.getLessonProgress(req.user.id, lessonId);
  }

  @Post('lesson/:lessonId/status')
  markLessonStatus(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Body() body: { status: string },
  ) {
    return this.progressService.markLessonStatus(req.user.id, lessonId, body.status);
  }
}
