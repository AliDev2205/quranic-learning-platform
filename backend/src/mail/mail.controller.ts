import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  // Formulaire de contact public (pas d'auth requise)
  @Post('contact')
  async sendContactMessage(
    @Body() body: { name: string; email: string; subject: string; message: string },
  ) {
    return this.mailService.sendContactMessage(body.name, body.email, body.subject, body.message);
  }

  // Test de configuration (Admin uniquement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('test')
  testConfiguration() {
    return this.mailService.testEmailConfiguration();
  }

  // Envoyer une notification manuelle (Admin uniquement)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('send-test')
  sendTestEmail(@Body() body: { email: string; name: string }) {
    return this.mailService.sendWelcomeEmail(body.email, body.name);
  }
}
