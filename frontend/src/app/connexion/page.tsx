'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faEnvelope, faLock, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

export default function ConnexionPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData.email, formData.password)
      const { access_token, user } = response.data

      login(user, access_token)
      toast.success(`Bienvenue ${user.name} !`)

      // Redirection selon le rôle
      if (user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/profil')
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err)
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
      toast.error('Connexion échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-20">
        <div className="max-w-md mx-auto">
          {/* Carte de connexion */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/20">
                <FontAwesomeIcon icon={faRightToBracket} className="text-2xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
              <p className="text-night-300">
                Accédez à votre espace d'apprentissage
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 animate-fade-in">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm" />
                </div>
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  />
                </div>
              </div>

              {/* Mot de passe oublié */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-night-300">
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-sm text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            {/* Lien vers inscription */}
            <div className="mt-6 text-center">
              <p className="text-night-300 text-sm">
                Vous n'avez pas de compte ?{' '}
                <Link
                  href="/inscription"
                  className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                >
                  Inscrivez-vous gratuitement
                </Link>
              </p>
            </div>

            {/* Compte de test */}
            <div className="mt-8 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
              <p className="text-primary-200 text-sm font-semibold mb-2">
                🔑 Compte de test Admin :
              </p>
              <p className="text-primary-300 text-xs">
                Email: admin@quranic-learning.com
              </p>
              <p className="text-primary-300 text-xs">
                Mot de passe: admin123
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
