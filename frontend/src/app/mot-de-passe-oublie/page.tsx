'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { toast } from 'sonner'

export default function MotDePasseOubliePage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Pour l'instant, afficher un message informatif
        // La fonctionnalité de reset sera implémentée côté backend
        setTimeout(() => {
            setSent(true)
            setLoading(false)
            toast.success('Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.')
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900 font-body">
            <Header />

            <div className="container-custom py-20">
                <div className="max-w-md mx-auto">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/20">
                                <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 font-heading">Mot de passe oublié</h1>
                            <p className="text-night-300">
                                Entrez votre adresse email pour recevoir un lien de réinitialisation
                            </p>
                        </div>

                        {sent ? (
                            <div className="text-center">
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                                    <p className="text-green-300 text-sm">
                                        ✅ Si un compte est associé à cette adresse email, vous recevrez un lien
                                        de réinitialisation sous quelques minutes. Vérifiez également vos spams.
                                    </p>
                                </div>
                                <Link
                                    href="/connexion"
                                    className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors font-bold"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                    Retour à la connexion
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-white font-medium mb-2">
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-600/30 disabled:opacity-50 transform hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className={loading ? 'animate-pulse' : ''} />
                                    {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                                </button>

                                <div className="text-center mt-4">
                                    <Link
                                        href="/connexion"
                                        className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors font-semibold"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                                        Retour à la connexion
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
