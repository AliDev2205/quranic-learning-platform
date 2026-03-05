'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faMapLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/mail/contact', formData)
      toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-20">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4 font-heading">Contactez-nous</h1>
          <p className="text-xl text-night-300 max-w-2xl mx-auto">
            Une question ? Une suggestion ? N'hésitez pas à nous contacter
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulaire */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Votre nom"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              {/* Sujet */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Sujet de votre message"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Votre message..."
                  required
                />
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-600/25 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              >
                <FontAwesomeIcon icon={faPaperPlane} className={loading ? 'animate-pulse' : ''} />
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          {/* Informations */}
          <div className="space-y-8">
            {/* Coordonnées */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Coordonnées</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-xl text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-0.5">Email</p>
                    <a href="mailto:contact@quranic-learning.com" className="text-night-300 hover:text-gold-400 transition-colors text-sm">
                      contact@quranic-learning.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="text-xl text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-0.5">Téléphone</p>
                    <a href="tel:+22912345678" className="text-night-300 hover:text-gold-400 transition-colors text-sm">
                      +229 XX XX XX XX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faMapLocationDot} className="text-xl text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold mb-0.5">Adresse</p>
                    <p className="text-night-300 text-sm">
                      Cotonou, Bénin
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Suivez-nous</h2>

              <div className="space-y-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/5 hover:bg-[#1877F2]/10 rounded-xl transition-all border border-white/5 hover:border-[#1877F2]/30 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1877F2]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faFacebook} className="text-xl text-[#1877F2]" />
                  </div>
                  <span className="text-white font-bold">Facebook</span>
                </a>

                <a
                  href="https://wa.me/22912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/5 hover:bg-[#25D366]/10 rounded-xl transition-all border border-white/5 hover:border-[#25D366]/30 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faWhatsapp} className="text-xl text-[#25D366]" />
                  </div>
                  <span className="text-white font-bold">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Disponibilité</h3>
              <p className="text-primary-100 leading-relaxed">
                Nous répondons généralement sous 24-48 heures. Pour les questions urgentes,
                contactez-nous via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
