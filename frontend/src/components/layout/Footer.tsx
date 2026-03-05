import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-night-900 to-night-950 border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                <img
                  src="/logo.jpg"
                  alt="Arabe Pas A Pas"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Arabe Pas A Pas</h3>
                <p className="text-xs text-gold-300">Apprendre l'arabe facilement</p>
              </div>
            </div>
            <p className="text-night-400 text-sm leading-relaxed mb-4">
              Plateforme moderne d'apprentissage de la langue arabe.
              Des leçons structurées, des exercices pratiques et un suivi personnalisé
              pour maîtriser l'arabe à votre rythme.
            </p>
            <p className="text-night-500 text-xs">
              Développé par <span className="text-gold-400 font-semibold">Soumanou Ousmane</span>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/lecons" className="text-night-400 hover:text-gold-400 transition-colors text-sm">
                  Leçons
                </Link>
              </li>
              <li>
                <Link href="/exercices" className="text-night-400 hover:text-gold-400 transition-colors text-sm">
                  Exercices
                </Link>
              </li>
              <li>
                <Link href="/progression" className="text-night-400 hover:text-gold-400 transition-colors text-sm">
                  Ma Progression
                </Link>
              </li>
              <li>
                <Link href="/mes-resultats" className="text-night-400 hover:text-gold-400 transition-colors text-sm">
                  Mes Résultats
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-night-400 hover:text-gold-400 transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-night-400 hover:text-gold-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href="mailto:contact@arabepasapas.com"
                  className="flex items-center gap-3 text-night-400 hover:text-gold-400 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="text-sm w-4" />
                  <span>contact@arabepasapas.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+22912345678"
                  className="flex items-center gap-3 text-night-400 hover:text-gold-400 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faPhone} className="text-sm w-4" />
                  <span>+229 XX XX XX XX</span>
                </a>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div>
              <h5 className="text-white font-semibold mb-3 text-sm">Suivez-nous</h5>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-gold-500 flex items-center justify-center transition-all group"
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} className="text-lg text-night-400 group-hover:text-night-900" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-gold-500 flex items-center justify-center transition-all group"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-lg text-night-400 group-hover:text-night-900" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-gold-500 flex items-center justify-center transition-all group"
                  aria-label="Twitter"
                >
                  <FontAwesomeIcon icon={faTwitter} className="text-lg text-night-400 group-hover:text-night-900" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-night-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Arabe Pas A Pas. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm justify-center">
              <Link href="/mentions-legales" className="text-night-500 hover:text-gold-400 transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="text-night-500 hover:text-gold-400 transition-colors">
                Confidentialité
              </Link>
              <Link href="/conditions" className="text-night-500 hover:text-gold-400 transition-colors">
                CGU
              </Link>
            </div>
          </div>
          <p className="text-center text-night-600 text-xs mt-4">
            Développé avec ❤️ pour faciliter l'apprentissage de l'arabe
          </p>
        </div>
      </div>
    </footer>
  )
}
