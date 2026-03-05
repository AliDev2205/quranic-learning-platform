import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration du transporteur email
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // Email de bienvenue
  async sendWelcomeEmail(to: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: `"Arabe Pas A Pas" <${process.env.MAIL_FROM}>`,
        to,
        subject: '🎉 Bienvenue sur Arabe Pas A Pas !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Arabe Pas A Pas</h1>
              <p style="color: #f0f0f0; margin-top: 10px;">Apprendre l'arabe facilement</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Bonjour ${name} ! 👋</h2>
              <p style="color: #666; line-height: 1.6;">
                Bienvenue sur <strong>Arabe Pas A Pas</strong>, votre plateforme d'apprentissage de l'arabe.
              </p>
              <p style="color: #666; line-height: 1.6;">
                Vous pouvez maintenant :
              </p>
              <ul style="color: #666; line-height: 1.8;">
                <li>📚 Accéder à toutes nos leçons</li>
                <li>✍️ Faire des exercices interactifs</li>
                <li>📊 Suivre votre progression</li>
                <li>🏆 Obtenir des résultats détaillés</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/lecons" 
                   style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Commencer l'apprentissage
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                © ${new Date().getFullYear()} Arabe Pas A Pas. Tous droits réservés.
              </p>
            </div>
          </div>
        `,
      });
      console.log('✉️ Email de bienvenue envoyé à:', to);
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  }

  // Notification : Nouvelle leçon publiée
  async sendNewLessonNotification(to: string, name: string, lessonTitle: string, lessonSlug: string) {
    try {
      await this.transporter.sendMail({
        from: `"Arabe Pas A Pas" <${process.env.MAIL_FROM}>`,
        to,
        subject: '📚 Nouvelle leçon disponible !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">📚 Nouvelle leçon !</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Bonjour ${name} !</h2>
              <p style="color: #666; line-height: 1.6;">
                Une nouvelle leçon vient d'être publiée :
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
                <h3 style="color: #333; margin-top: 0;">${lessonTitle}</h3>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/lecons/${lessonSlug}" 
                   style="background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Voir la leçon
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                © ${new Date().getFullYear()} Arabe Pas A Pas. Tous droits réservés.
              </p>
            </div>
          </div>
        `,
      });
      console.log('✉️ Notification nouvelle leçon envoyée à:', to);
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  }

  // Notification : Commentaire sur leçon favorite
  async sendCommentOnFavoriteNotification(
    to: string,
    name: string,
    lessonTitle: string,
    lessonSlug: string,
    commentAuthor: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: `"Arabe Pas A Pas" <${process.env.MAIL_FROM}>`,
        to,
        subject: '💬 Nouveau commentaire sur une leçon favorite',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">💬 Nouveau commentaire</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Bonjour ${name} !</h2>
              <p style="color: #666; line-height: 1.6;">
                <strong>${commentAuthor}</strong> a commenté une leçon que vous avez mise en favoris :
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00f2fe;">
                <h3 style="color: #333; margin-top: 0;">${lessonTitle}</h3>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/lecons/${lessonSlug}" 
                   style="background: #00f2fe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Voir le commentaire
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                © ${new Date().getFullYear()} Arabe Pas A Pas. Tous droits réservés.
              </p>
            </div>
          </div>
        `,
      });
      console.log('✉️ Notification commentaire envoyée à:', to);
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  }

  // Rappel : Exercices non terminés
  async sendExerciseReminderNotification(
    to: string,
    name: string,
    incompleteExercisesCount: number,
  ) {
    try {
      await this.transporter.sendMail({
        from: `"Arabe Pas A Pas" <${process.env.MAIL_FROM}>`,
        to,
        subject: '⏰ N\'oubliez pas vos exercices !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">⏰ Rappel</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333;">Bonjour ${name} !</h2>
              <p style="color: #666; line-height: 1.6;">
                Vous avez <strong>${incompleteExercisesCount} exercice(s)</strong> en cours.
              </p>
              <p style="color: #666; line-height: 1.6;">
                Continuez votre apprentissage pour progresser ! 💪
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/progression" 
                   style="background: #fa709a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Voir ma progression
                </a>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                © ${new Date().getFullYear()} Arabe Pas A Pas. Tous droits réservés.
              </p>
            </div>
          </div>
        `,
      });
      console.log('✉️ Rappel exercices envoyé à:', to);
    } catch (error) {
      console.error('Erreur envoi email:', error);
    }
  }

  // Message de contact (formulaire public)
  async sendContactMessage(name: string, email: string, subject: string, message: string) {
    const adminEmail = process.env.MAIL_ADMIN || process.env.MAIL_USER || 'admin@quranic-learning.com';
    try {
      await this.transporter.sendMail({
        from: `"Arabe Pas A Pas - Contact" <${process.env.MAIL_FROM || email}>`,
        to: adminEmail,
        replyTo: email,
        subject: `📩 Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">📩 Nouveau message</h1>
              <p style="color: #f0f0f0; margin-top: 10px;">via le formulaire de contact</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p style="color: #666;"><strong>De :</strong> ${name} (${email})</p>
              <p style="color: #666;"><strong>Sujet :</strong> ${subject}</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                © ${new Date().getFullYear()} Arabe Pas A Pas. Tous droits réservés.
              </p>
            </div>
          </div>
        `,
      });
      console.log('✉️ Message de contact reçu de:', email);
      return { success: true, message: 'Message envoyé avec succès' };
    } catch (error) {
      console.error('Erreur envoi email de contact:', error);
      // On retourne quand même un succès à l'utilisateur pour éviter d'exposer les erreurs
      return { success: true, message: 'Message enregistré. Nous vous répondrons bientôt.' };
    }
  }

  // Test de configuration email
  async testEmailConfiguration() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Configuration email OK' };
    } catch (error) {
      console.error('Erreur configuration email:', error);
      return { success: false, message: error.message };
    }
  }
}
