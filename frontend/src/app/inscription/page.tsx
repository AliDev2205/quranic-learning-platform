'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faEnvelope, faLock, faUser, faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

export default function InscriptionPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.register(formData.name, formData.email, formData.password)
      const { access_token, user } = response.data

      login(user, access_token)
      toast.success(`Bienvenue ${user.name} ! Votre compte a été créé avec succès.`)
      router.push('/profil')
    } catch (err: any) {
      console.error('Erreur d\'inscription:', err)
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription')
      toast.error('Inscription échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-20">
        <div className="max-w-md mx-auto">
          {/* Carte d'inscription */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/20">
                <FontAwesomeIcon icon={faUserPlus} className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Inscription</h1>
              <p className="text-night-300">
                Créez votre compte et commencez à apprendre
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 mt-1" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-400" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-white font-medium mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-400" />
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-night-400 mt-1">
                  Au moins 6 caractères
                </p>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-600 focus:ring-2 focus:ring-primary-500 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-night-300">
                  J'accepte les{' '}
                  <Link href="/conditions" className="text-gold-400 hover:text-gold-300 transition-colors">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/confidentialite" className="text-gold-400 hover:text-gold-300 transition-colors">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  'Inscription en cours...'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} className="text-lg" />
                    Créer mon compte
                  </>
                )}
              </button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-6 text-center">
              <p className="text-night-300 text-sm">
                Vous avez déjà un compte ?{' '}
                <Link
                  href="/connexion"
                  className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                >
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>

          {/* Avantages */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              '100% Gratuit',
              'Accès illimité',
              'Suivi personnalisé'
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-night-300 text-sm font-medium"
              >
                <FontAwesomeIcon icon={faCircleCheck} className="text-primary-400" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
