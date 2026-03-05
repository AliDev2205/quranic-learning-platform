import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const { questions, ...exerciseData } = data;

    return this.prisma.exercise.create({
      data: {
        ...exerciseData,
        questions: {
          create: questions?.map((q: any, index: number) => ({
            question: q.text, // Le frontend envoie "text", on le mappe vers "question"
            order: index,
            answers: {
              create: q.answers?.map((a: any, aIndex: number) => ({
                text: a.text,
                isCorrect: a.isCorrect || false,
                order: aIndex,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.exercise.findMany({
      include: {
        lesson: { select: { id: true, title: true } },
        questions: {
          include: { answers: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.exercise.findMany({
      where: { lessonId },
      include: {
        questions: {
          include: { answers: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        questions: {
          include: { answers: true },
          orderBy: { order: 'asc' },
        },
        lesson: true,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Exercice non trouvé');
    }

    return exercise;
  }

  async submitExercise(exerciseId: string, userId: string, answers: any) {
    const exercise = await this.findOne(exerciseId);

    let score = null;
    const details: any = {};

    // Calculer le score pour les QCM
    if (exercise.type === 'QCM') {
      let correctAnswers = 0;
      const totalQuestions = exercise.questions.length;

      exercise.questions.forEach((question) => {
        const userAnswer = answers[question.id];
        const correctAnswerIds = question.answers
          .filter(a => a.isCorrect)
          .map(a => a.id);

        // Normaliser la réponse utilisateur en tableau
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

        // Vérifier si les réponses correspondent exactement
        const isCorrect =
          userAnswerArray.length === correctAnswerIds.length &&
          userAnswerArray.every(id => correctAnswerIds.includes(id)) &&
          correctAnswerIds.every(id => userAnswerArray.includes(id));

        if (isCorrect) {
          correctAnswers++;
        }

        details[question.id] = {
          isCorrect,
          userAnswer: userAnswerArray,
          correctAnswers: correctAnswerIds,
        };
      });

      score = Math.round((correctAnswers / totalQuestions) * 100);
    }

    return this.prisma.exerciseResult.create({
      data: {
        userId,
        exerciseId,
        score,
        answers,
      },
    }).then(result => ({
      ...result,
      score: score ?? 0,
      details,
    }));
  }

  async answerQuestion(exerciseId: string, questionId: string, userId: string, answer: any) {
    const exercise = await this.findOne(exerciseId);
    const question = exercise.questions.find(q => q.id === questionId);

    if (!question) {
      throw new NotFoundException('Question non trouvée');
    }

    // Récupérer ou créer le résultat de l'exercice
    let result = await this.prisma.exerciseResult.findFirst({
      where: { userId, exerciseId },
    });

    const answers = result?.answers || {};

    // Vérifier si la question n'a pas déjà été répondue
    if (answers[questionId] !== undefined) {
      throw new Error('Question déjà répondue');
    }

    // Sauvegarder la réponse
    answers[questionId] = answer;

    // Calculer si la réponse est correcte (pour QCM)
    let isCorrect = false;
    if (exercise.type === 'QCM') {
      const correctAnswerIds = question.answers
        .filter(a => a.isCorrect)
        .map(a => a.id);

      const userAnswerArray = Array.isArray(answer) ? answer : [answer];

      isCorrect =
        userAnswerArray.length === correctAnswerIds.length &&
        userAnswerArray.every(id => correctAnswerIds.includes(id)) &&
        correctAnswerIds.every(id => userAnswerArray.includes(id));
    }

    // Calculer le score global
    const totalAnswered = Object.keys(answers).length;
    let correctCount = 0;

    if (exercise.type === 'QCM') {
      exercise.questions.forEach((q) => {
        if (answers[q.id] !== undefined) {
          const correctIds = q.answers.filter(a => a.isCorrect).map(a => a.id);
          const userAns = Array.isArray(answers[q.id]) ? answers[q.id] : [answers[q.id]];

          if (
            userAns.length === correctIds.length &&
            userAns.every(id => correctIds.includes(id)) &&
            correctIds.every(id => userAns.includes(id))
          ) {
            correctCount++;
          }
        }
      });
    }

    const globalScore = exercise.type === 'QCM'
      ? Math.round((correctCount / exercise.questions.length) * 100)
      : 0;

    // Créer ou mettre à jour le résultat
    if (!result) {
      result = await this.prisma.exerciseResult.create({
        data: {
          userId,
          exerciseId,
          answers,
          score: globalScore,
        },
      });
    } else {
      result = await this.prisma.exerciseResult.update({
        where: { id: result.id },
        data: {
          answers,
          score: globalScore,
        },
      });
    }

    return {
      isCorrect,
      globalScore: globalScore ?? 0,
      totalAnswered,
      totalQuestions: exercise.questions.length,
    };
  }

  async getMyAnswers(userId: string, exerciseId: string) {
    const result = await this.prisma.exerciseResult.findFirst({
      where: { userId, exerciseId },
    });

    if (!result) {
      return null;
    }

    const exercise = await this.findOne(exerciseId);
    const questionResults: any = {};

    // Calculer le résultat de chaque question
    if (exercise.type === 'QCM') {
      exercise.questions.forEach((question) => {
        const userAnswer = result.answers[question.id];
        if (userAnswer !== undefined) {
          const correctAnswerIds = question.answers
            .filter(a => a.isCorrect)
            .map(a => a.id);

          const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

          const isCorrect =
            userAnswerArray.length === correctAnswerIds.length &&
            userAnswerArray.every(id => correctAnswerIds.includes(id)) &&
            correctAnswerIds.every(id => userAnswerArray.includes(id));

          questionResults[question.id] = { isCorrect };
        }
      });
    }

    return {
      answers: result.answers,
      score: result.score ?? 0,
      questionResults,
    };
  }

  async getUserResults(userId: string, exerciseId: string) {
    return this.prisma.exerciseResult.findMany({
      where: { userId, exerciseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllMyResults(userId: string) {
    return this.prisma.exerciseResult.findMany({
      where: { userId },
      include: {
        exercise: {
          select: {
            id: true,
            title: true,
            type: true,
            lesson: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            questions: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.exercise.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.exercise.delete({ where: { id } });
  }
}
