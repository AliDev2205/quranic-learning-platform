import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, lessonId: string, content: string) {
    return this.prisma.comment.create({
      data: { userId, lessonId, content, status: 'PENDING' },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.comment.findMany({
      where: { lessonId, status: 'APPROVED' },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending() {
    return this.prisma.comment.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        lesson: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.comment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        lesson: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
