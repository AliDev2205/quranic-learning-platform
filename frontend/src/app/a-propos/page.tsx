'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faHeart, faBullseye, faAward } from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-20">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 font-amiri">
            À propos de la plateforme
          </h1>
          <p className="text-xl text-night-300 max-w-3xl mx-auto leading-relaxed">
            Une initiative dédiée à l'enseignement de la lecture coranique pour tous
          </p>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faHeart} className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Notre Mission</h2>
            </div>
            <p className="text-night-300 text-lg leading-relaxed mb-6">
              Notre plateforme a pour mission de rendre l'apprentissage de la lecture coranique
              accessible à tous, en proposant des leçons structurées, des exercices pratiques et
              un suivi personnalisé de la progression.
            </p>
            <p className="text-night-300 text-lg leading-relaxed">
              Nous croyons que chaque musulman devrait avoir la possibilité d'apprendre à lire
              le Saint Coran correctement, selon les règles du Tajweed, dans un environnement
              d'apprentissage moderne et interactif.
            </p>
          </div>
        </div>

        {/* Valeurs */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-gold-400" />,
              title: 'Excellence Pédagogique',
              description: 'Des cours structurés et progressifs, conçus pour garantir une compréhension approfondie de chaque concept.'
            },
            {
              icon: <FontAwesomeIcon icon={faBullseye} className="text-4xl text-primary-400" />,
              title: 'Accessibilité',
              description: 'Une plateforme gratuite et accessible à tous, disponible 24h/24 depuis n\'importe quel appareil.'
            },
            {
              icon: <FontAwesomeIcon icon={faAward} className="text-4xl text-gold-400" />,
              title: 'Suivi Personnalisé',
              description: 'Un système de progression qui s\'adapte à votre rythme et vous accompagne dans votre apprentissage.'
            }
          ].map((valeur, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
            >
              <div className="mb-6">{valeur.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{valeur.title}</h3>
              <p className="text-night-300 leading-relaxed">{valeur.description}</p>
            </div>
          ))}
        </div>

        {/* Enseignant */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">👨‍🏫</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 font-amiri">
              Soumanou Ousmane
            </h2>
            <p className="text-primary-100 text-lg mb-6">
              Fondateur et Enseignant Principal
            </p>
            <p className="text-white leading-relaxed max-w-2xl mx-auto mb-8">
              Passionné par l'enseignement du Coran depuis plusieurs années, j'ai créé cette
              plateforme pour partager mes connaissances et aider le plus grand nombre à
              maîtriser l'art de la lecture coranique.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-white/20 rounded-lg">
                <p className="text-white font-semibold">+10 ans</p>
                <p className="text-primary-100 text-sm">d'expérience</p>
              </div>
              <div className="px-6 py-3 bg-white/20 rounded-lg">
                <p className="text-white font-semibold">+100</p>
                <p className="text-primary-100 text-sm">élèves formés</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-6">
            Prêt à commencer votre apprentissage ?
          </h3>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/inscription"
              className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-night-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              S'inscrire gratuitement
            </a>
            <a
              href="/lecons"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20"
            >
              Découvrir les leçons
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
