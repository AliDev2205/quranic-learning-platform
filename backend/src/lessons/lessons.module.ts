import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/lessons',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB pour audio/vidéo
      },
      fileFilter: (req, file, cb) => {
        // Accepter images, audio et vidéo
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
          'audio/ogg',
          'video/mp4',
          'video/webm',
          'video/ogg',
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Format de fichier non supporté'), false);
        }
      },
    }),
  ],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
