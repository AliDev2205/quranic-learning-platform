'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ConditionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
            <Header />

            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8">Conditions Générales d'Utilisation</h1>
                    <p className="text-night-400 text-sm mb-12">Dernière mise à jour : Février 2025</p>

                    <div className="space-y-8 text-night-300 leading-relaxed">
                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Présentation</h2>
                            <p>
                                La plateforme « Arabe Pas A Pas » (ci-après « le Site ») est éditée par M. Soumanou Ousmane.
                                Elle propose des contenus pédagogiques gratuits pour l'apprentissage de la langue arabe et
                                de la lecture coranique. En utilisant le Site, vous acceptez les présentes conditions.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Accès au service</h2>
                            <p className="mb-3">
                                Le Site est accessible gratuitement à toute personne disposant d'un accès Internet.
                                Certaines fonctionnalités nécessitent la création d'un compte utilisateur.
                            </p>
                            <p>
                                L'administrateur se réserve le droit de modifier, suspendre ou supprimer le service
                                à tout moment, sans préavis, pour des raisons de maintenance ou d'évolution.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">3. Inscription</h2>
                            <p className="mb-3">
                                L'inscription est gratuite. L'utilisateur s'engage à fournir des informations exactes
                                et à maintenir la confidentialité de son mot de passe.
                            </p>
                            <p>
                                Tout usage abusif ou non conforme aux présentes conditions pourra entraîner la
                                suspension ou la suppression du compte, sans préavis.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Propriété intellectuelle</h2>
                            <p>
                                L'ensemble du contenu du Site (textes, leçons, exercices, images, logos, design)
                                est la propriété exclusive de M. Soumanou Ousmane. Toute reproduction, distribution
                                ou utilisation commerciale sans autorisation préalable est interdite.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Commentaires et modération</h2>
                            <p>
                                Les utilisateurs peuvent publier des commentaires sous les leçons. Ces commentaires
                                sont soumis à modération. L'administrateur se réserve le droit de refuser, modifier
                                ou supprimer tout commentaire jugé inapproprié, offensant ou hors sujet.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation de responsabilité</h2>
                            <p>
                                Le Site est fourni « en l'état ». L'administrateur ne saurait être tenu responsable
                                d'éventuelles erreurs dans le contenu pédagogique, ni d'interruptions du service.
                                L'utilisation du Site se fait sous la responsabilité de l'utilisateur.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contact</h2>
                            <p>
                                Pour toute question relative aux présentes conditions, veuillez nous contacter via
                                la <a href="/contact" className="text-gold-400 hover:text-gold-300 underline">page de contact</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
