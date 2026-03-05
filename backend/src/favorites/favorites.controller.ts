import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findMyFavorites(@Request() req) {
    return this.favoritesService.findMyFavorites(req.user.id);
  }

  @Get(':lessonId/check')
  isFavorite(@Request() req, @Param('lessonId') lessonId: string) {
    return this.favoritesService.isFavorite(req.user.id, lessonId);
  }

  @Post(':lessonId')
  addFavorite(@Request() req, @Param('lessonId') lessonId: string) {
    return this.favoritesService.addFavorite(req.user.id, lessonId);
  }

  @Delete(':lessonId')
  removeFavorite(@Request() req, @Param('lessonId') lessonId: string) {
    return this.favoritesService.removeFavorite(req.user.id, lessonId);
  }
}
