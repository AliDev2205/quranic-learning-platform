import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-results')
  getAllMyResults(@Request() req) {
    return this.exercisesService.getAllMyResults(req.user.id);
  }

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.exercisesService.findByLesson(lessonId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/answer')
  answerQuestion(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.exercisesService.answerQuestion(id, body.questionId, req.user.id, body.answer);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/my-answers')
  getMyAnswers(@Param('id') id: string, @Request() req) {
    return this.exercisesService.getMyAnswers(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.exercisesService.submitExercise(id, req.user.id, body.answers);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/my-results')
  getMyResults(@Param('id') id: string, @Request() req) {
    return this.exercisesService.getUserResults(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createExerciseDto: any) {
    return this.exercisesService.create(createExerciseDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseDto: any) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}
