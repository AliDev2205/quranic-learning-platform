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
  const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const origins = rawFrontendUrl.split(',').map((url) => url.trim());

  // Autoriser avec et sans slash final pour plus de robustesse
  const allowedOrigins = [];
  origins.forEach(url => {
    const cleanUrl = url.replace(/\/$/, '');
    allowedOrigins.push(cleanUrl);
    allowedOrigins.push(`${cleanUrl}/`);
  });

  console.log('🌐 Allowed Origins:', allowedOrigins);

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
