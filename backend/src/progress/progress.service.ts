import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) { }

  async getMyProgress(userId: string) {
    const progress = await this.prisma.lessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            slug: true,
            level: true,
            category: true,
            exercises: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const totalLessons = await this.prisma.lesson.count({
      where: { status: 'PUBLISHED' },
    });

    const completedLessons = progress.filter(p => p.status === 'COMPLETED').length;

    // Calculer les exercices complétés (doit avoir répondu à toutes les questions)
    const exerciseResults = await this.prisma.exerciseResult.findMany({
      where: { userId },
      include: {
        exercise: {
          include: {
            questions: { select: { id: true } }
          }
        },
      },
    });

    const totalExercises = await this.prisma.exercise.count({
      where: {
        lesson: {
          status: 'PUBLISHED',
        },
      },
    });

    const completedExercises = exerciseResults.filter(result => {
      const answeredCount = result.answers ? Object.keys(result.answers as object).length : 0;
      const totalQuestions = result.exercise.questions.length;
      return totalQuestions > 0 && answeredCount >= totalQuestions;
    }).length;

    // Calculer le score moyen des exercices QCM
    const qcmResults = exerciseResults.filter(r => r.score !== null);
    const averageScore = qcmResults.length > 0
      ? Math.round(qcmResults.reduce((sum, r) => sum + (r.score || 0), 0) / qcmResults.length)
      : 0;

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Enrichir progress avec les pourcentages calculés
    const enrichedProgress = await Promise.all(
      progress.map(async (p) => {
        const lessonExercises = p.lesson.exercises;
        let progressPercentage = 0;

        if (lessonExercises.length > 0) {
          const results = await this.prisma.exerciseResult.findMany({
            where: {
              userId,
              exerciseId: { in: lessonExercises.map(e => e.id) },
            },
            include: {
              exercise: {
                include: {
                  questions: { select: { id: true } }
                }
              }
            }
          });

          const completedCount = results.filter(result => {
            const answeredCount = result.answers ? Object.keys(result.answers as object).length : 0;
            const totalQuestions = result.exercise.questions.length;
            return totalQuestions > 0 && answeredCount >= totalQuestions;
          }).length;

          progressPercentage = Math.round((completedCount / lessonExercises.length) * 100);
        } else {
          progressPercentage = p.status === 'COMPLETED' ? 100 : 0;
        }

        return {
          ...p,
          progressPercentage,
        };
      })
    );

    return {
      progress: enrichedProgress,
      statistics: {
        totalLessons,
        completedLessons,
        inProgressLessons: progress.filter(p => p.status === 'IN_PROGRESS').length,
        percentage,
        totalExercises,
        completedExercises,
        averageScore,
      },
    };
  }

  async markLessonStatus(userId: string, lessonId: string, status: string) {
    // Valider le status
    const validStatus = status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS';

    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        status: validStatus as any,
        ...(validStatus === 'COMPLETED' && { completedAt: new Date() }),
      },
      create: {
        userId,
        lessonId,
        status: validStatus as any,
        ...(validStatus === 'COMPLETED' && { completedAt: new Date() }),
      },
    });
  }

  async getLessonProgress(userId: string, lessonId: string) {
    const progress = await this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    // Récupérer les exercices de la leçon
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        exercises: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!lesson) {
      return null;
    }

    // Calculer la progression basée sur les exercices UNIQUES complétés
    let calculatedPercentage = 0;
    let completedExercises = 0;

    if (lesson.exercises.length > 0) {
      // Récupérer les résultats pour les exercices de la leçon
      const results = await this.prisma.exerciseResult.findMany({
        where: {
          userId,
          exerciseId: { in: lesson.exercises.map(e => e.id) },
        },
        include: {
          exercise: {
            include: {
              questions: { select: { id: true } }
            }
          }
        }
      });

      completedExercises = results.filter(result => {
        const answeredCount = result.answers ? Object.keys(result.answers as object).length : 0;
        const totalQuestions = result.exercise.questions.length;
        return totalQuestions > 0 && answeredCount >= totalQuestions;
      }).length;

      calculatedPercentage = Math.round((completedExercises / lesson.exercises.length) * 100);
    } else {
      // Pas d'exercices, se baser sur le statut
      calculatedPercentage = progress?.status === 'COMPLETED' ? 100 : 0;
    }

    return {
      ...progress,
      progressPercentage: calculatedPercentage,
      totalExercises: lesson.exercises.length,
      completedExercises,
    };
  }
}
