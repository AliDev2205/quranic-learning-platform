import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findMyFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            level: true,
            imageUrl: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addFavorite(userId: string, lessonId: string) {
    // Vérifier si déjà en favoris
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    if (existing) {
      return existing; // Déjà en favoris, on retourne l'existant
    }

    return this.prisma.favorite.create({
      data: { userId, lessonId },
    });
  }

  async removeFavorite(userId: string, lessonId: string) {
    return this.prisma.favorite.delete({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });
  }

  async isFavorite(userId: string, lessonId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });
    return { isFavorite: !!favorite };
  }
}
