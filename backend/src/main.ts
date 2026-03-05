import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir les fichiers statiques depuis le dossier uploads
  // Utiliser un chemin absolu depuis la racine du projet
  const uploadsPath = join(process.cwd(), 'uploads');
  console.log('📁 Uploads path:', uploadsPath);

  app.use('/uploads', express.static(uploadsPath));

  // Configuration CORS
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Validation globale des données
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Préfixe global pour l'API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Backend API démarrée sur http://localhost:${port}/api`);
  console.log(`📁 Fichiers uploads disponibles sur http://localhost:${port}/uploads/`);
}

bootstrap();
