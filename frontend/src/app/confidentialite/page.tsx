'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ConfidentialitePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
            <Header />

            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Politique de Confidentialité</h1>
                    <p className="text-night-400 text-sm mb-12">Dernière mise à jour : Février 2025</p>

                    <div className="space-y-8 text-night-300 leading-relaxed">
                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Collecte des données</h2>
                            <p className="mb-3">
                                Lors de votre inscription sur « Arabe Pas A Pas », nous collectons les données suivantes :
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Nom complet</li>
                                <li>Adresse email</li>
                                <li>Mot de passe (stocké de manière chiffrée)</li>
                            </ul>
                            <p className="mt-3">
                                Nous collectons également automatiquement vos données de progression
                                (leçons suivies, résultats d'exercices, favoris) pour vous offrir un suivi personnalisé.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Utilisation des données</h2>
                            <p className="mb-3">Vos données personnelles sont utilisées pour :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Gérer votre compte utilisateur</li>
                                <li>Personnaliser votre expérience d'apprentissage</li>
                                <li>Suivre votre progression et vos résultats</li>
                                <li>Vous envoyer des notifications liées à votre apprentissage (si activé)</li>
                                <li>Répondre à vos demandes via le formulaire de contact</li>
                            </ul>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">3. Protection des données</h2>
                            <p>
                                Vos données sont protégées par des mesures de sécurité techniques appropriées.
                                Les mots de passe sont chiffrés avec l'algorithme bcrypt. L'accès aux données
                                d'administration est protégé par un système d'authentification JWT.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Partage des données</h2>
                            <p>
                                Vos données personnelles ne sont jamais vendues, échangées ou partagées avec des
                                tiers à des fins commerciales. Elles sont uniquement utilisées dans le cadre du
                                fonctionnement de la plateforme.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies</h2>
                            <p>
                                Le Site utilise le stockage local du navigateur (localStorage) pour maintenir
                                votre session de connexion et vos préférences (thème clair/sombre).
                                Aucun cookie tiers n'est utilisé.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">6. Vos droits</h2>
                            <p className="mb-3">Vous disposez des droits suivants :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong className="text-white">Accès :</strong> Vous pouvez consulter vos données via votre profil</li>
                                <li><strong className="text-white">Rectification :</strong> Vous pouvez modifier vos informations personnelles</li>
                                <li><strong className="text-white">Suppression :</strong> Vous pouvez demander la suppression de votre compte</li>
                            </ul>
                            <p className="mt-3">
                                Pour exercer ces droits, contactez-nous via la{' '}
                                <a href="/contact" className="text-gold-400 hover:text-gold-300 underline">page de contact</a>.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contact</h2>
                            <p>
                                Pour toute question relative à la protection de vos données, veuillez nous
                                contacter via la <a href="/contact" className="text-gold-400 hover:text-gold-300 underline">page de contact</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
