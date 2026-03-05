import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // Créer l'administrateur par défaut
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quranic-learning.com' },
    update: {},
    create: {
      email: 'admin@quranic-learning.com',
      password: hashedPassword,
      name: 'Soumanou Ousmane',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin créé:', admin.email);

  // Créer quelques catégories de base
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tajweed' },
      update: {},
      create: {
        name: 'Tajweed',
        slug: 'tajweed',
        description: 'Règles de récitation coranique',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'alphabet-arabe' },
      update: {},
      create: {
        name: 'Alphabet Arabe',
        slug: 'alphabet-arabe',
        description: 'Apprentissage des lettres arabes',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lecture-coranique' },
      update: {},
      create: {
        name: 'Lecture Coranique',
        slug: 'lecture-coranique',
        description: 'Pratique de la lecture du Coran',
        order: 3,
      },
    }),
  ]);

  console.log('✅ Catégories créées:', categories.length);

  // Créer une leçon d'exemple
  const lesson = await prisma.lesson.upsert({
    where: { slug: 'introduction-a-la-lecture-coranique' },
    update: {},
    create: {
      title: 'Introduction à la lecture coranique',
      slug: 'introduction-a-la-lecture-coranique',
      content: `
# Introduction à la lecture coranique

Bienvenue dans cette première leçon d'apprentissage de la lecture du Coran.

## Qu'est-ce que la lecture coranique ?

La lecture coranique, appelée **Tajweed** en arabe, est l'art de réciter le Coran selon les règles établies.

## Objectifs de cette leçon

- Comprendre l'importance de la lecture correcte
- Découvrir les bases de l'alphabet arabe
- Commencer à lire les lettres

## Les lettres arabes

L'alphabet arabe compte 28 lettres. Chaque lettre a une forme différente selon sa position dans le mot.

### Première lettre : Alif (ا)

La lettre Alif est la première lettre de l'alphabet arabe.

---

*Dans les prochaines leçons, nous approfondirons chaque aspect de la lecture coranique.*
      `,
      description: 'Découvrez les bases de la lecture coranique et commencez votre apprentissage',
      level: 'BEGINNER',
      status: 'PUBLISHED',
      order: 1,
      categoryId: categories[0].id,
    },
  });

  console.log('✅ Leçon d\'exemple créée:', lesson.title);

  console.log('🎉 Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
