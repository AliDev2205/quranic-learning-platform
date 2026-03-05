import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) { }

  // Créer une leçon
  async create(createLessonDto: CreateLessonDto) {
    const slug = this.generateSlug(createLessonDto.title);

    const lesson = await this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        slug,
      },
      include: {
        category: true,
      },
    });

    // Si la leçon est publiée, notifier tous les apprenants
    if (lesson.status === 'PUBLISHED') {
      try {
        const learners = await this.prisma.user.findMany({
          where: { role: 'LEARNER' },
          select: { email: true, name: true },
        });

        // Envoyer à tous les apprenants (en arrière-plan)
        for (const learner of learners) {
          this.mailService.sendNewLessonNotification(
            learner.email,
            learner.name,
            lesson.title,
            lesson.slug,
          ).catch(err => console.error('Erreur envoi email:', err));
        }
      } catch (error) {
        console.error('Erreur notification nouvelle leçon:', error);
      }
    }

    return lesson;
  }

  // Récupérer toutes les leçons (pour l'admin)
  async findAll() {
    return this.prisma.lesson.findMany({
      include: {
        category: true,
        exercises: true,
        _count: {
          select: {
            comments: true,
            favorites: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  // Récupérer les leçons publiées (pour les apprenants)
  async findPublished(categoryId?: string, level?: string) {
    const where: any = { status: 'PUBLISHED' };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (level) {
      where.level = level;
    }

    return this.prisma.lesson.findMany({
      where,
      include: {
        category: true,
        exercises: true,
        _count: {
          select: {
            comments: { where: { status: 'APPROVED' } },
            favorites: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  // Récupérer une leçon par son ID
  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        category: true,
        exercises: {
          include: {
            questions: {
              include: {
                answers: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        comments: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Leçon non trouvée');
    }

    return lesson;
  }

  // Récupérer une leçon par son slug (pour l'affichage public)
  async findBySlug(slug: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        category: true,
        exercises: {
          include: {
            questions: {
              include: {
                answers: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        comments: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Leçon non trouvée');
    }

    return lesson;
  }

  // Mettre à jour une leçon
  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.findOne(id);

    let slug = lesson.slug;
    if (updateLessonDto.title && updateLessonDto.title !== lesson.title) {
      slug = this.generateSlug(updateLessonDto.title);
    }

    return this.prisma.lesson.update({
      where: { id },
      data: {
        ...updateLessonDto,
        slug,
      },
      include: {
        category: true,
      },
    });
  }

  // Supprimer une leçon
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.lesson.delete({ where: { id } });
  }

  // Rechercher des leçons
  async search(query: string) {
    return this.prisma.lesson.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Générer un slug à partir du titre
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
