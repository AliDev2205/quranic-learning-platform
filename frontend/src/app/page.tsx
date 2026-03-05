'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faAward,
  faChartLine,
  faUsers,
  faArrowRight,
  faStar,
  faComments,
  faCircleCheck,
  faBolt
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { lessonsAPI } from '@/lib/api'

interface Lesson {
  id: string
  title: string
  slug: string
  description: string
  level: string
  imageUrl: string | null
  createdAt: string
  category: {
    id: string
    name: string
  } | null
}

export default function HomePage() {
  const [latestLessons, setLatestLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLatestLessons()
  }, [])

  const loadLatestLessons = async () => {
    try {
      const response = await lessonsAPI.getPublished()
      // Prendre les 6 dernières leçons
      setLatestLessons(response.data.slice(0, 6))
    } catch (error) {
      console.error('Erreur de chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'Débutant'
      case 'INTERMEDIATE': return 'Intermédiaire'
      case 'ADVANCED': return 'Avancé'
      default: return level
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-primary-500/20 text-primary-300 border-primary-500/30'
      case 'INTERMEDIATE': return 'bg-gold-500/20 text-gold-300 border-gold-500/30'
      case 'ADVANCED': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-night-500/20 text-night-300 border-night-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Motif décoratif en arrière-plan */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>

        <div className="container-custom py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Citation coranique */}
            <div className="mb-8 inline-block px-6 py-3 bg-gold-500/10 border border-gold-500/30 rounded-full">
              <p className="text-gold-300 text-sm md:text-base font-amiri">
                ﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾
              </p>
              <p className="text-gold-400/70 text-xs mt-1">
                « Lis au nom de ton Seigneur qui a créé » — Sourate Al-Alaq, v.1
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Apprenez l'arabe{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                pas à pas
              </span>
            </h1>

            <p className="text-lg md:text-xl text-night-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Une plateforme moderne et interactive pour apprendre la lecture coranique,
              avec des leçons structurées, des exercices pratiques et un suivi personnalisé
              de votre progression.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/inscription"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-night-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-gold-500/25 hover:scale-105 flex items-center justify-center gap-2"
              >
                Commencer gratuitement
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </Link>
              <Link
                href="/lecons"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 flex items-center justify-center gap-3"
              >
                <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
                Découvrir les leçons
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATISTIQUES ===== */}
      <section className="border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container-custom py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-primary-400" />, value: 'Structurées', label: 'Leçons complètes' },
              { icon: <FontAwesomeIcon icon={faAward} className="text-2xl text-gold-400" />, value: 'QCM & Ouverts', label: 'Exercices interactifs' },
              { icon: <FontAwesomeIcon icon={faChartLine} className="text-2xl text-green-400" />, value: 'Personnalisé', label: 'Suivi de progression' },
              { icon: <FontAwesomeIcon icon={faUsers} className="text-2xl text-primary-400" />, value: 'Gratuit', label: 'Accès pour tous' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-night-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FONCTIONNALITÉS ===== */}
      <section className="container-custom py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pourquoi choisir notre plateforme ?
          </h2>
          <p className="text-night-300 text-lg max-w-2xl mx-auto">
            Des outils modernes au service de l'apprentissage traditionnel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-gold-400" />,
              title: 'Leçons structurées',
              description: 'Un programme progressif adapté à tous les niveaux : débutant, intermédiaire et avancé. Chaque leçon est accompagnée d\'images, d\'audio et de vidéo.',
            },
            {
              icon: <FontAwesomeIcon icon={faAward} className="text-3xl text-primary-400" />,
              title: 'Exercices interactifs',
              description: 'Des QCM avec correction automatique et des questions ouvertes pour renforcer vos acquis. Suivez vos scores et votre historique.',
            },
            {
              icon: <FontAwesomeIcon icon={faChartLine} className="text-3xl text-green-400" />,
              title: 'Suivi personnalisé',
              description: 'Visualisez votre progression en temps réel, marquez vos leçons favorites et consultez l\'historique complet de vos exercices.',
            },
            {
              icon: <FontAwesomeIcon icon={faStar} className="text-3xl text-gold-400" />,
              title: 'Favoris & Catégories',
              description: 'Sauvegardez vos leçons préférées et naviguez facilement grâce aux catégories et aux filtres par niveau.',
            },
            {
              icon: <FontAwesomeIcon icon={faComments} className="text-3xl text-primary-400" />,
              title: 'Communauté',
              description: 'Posez vos questions sous les leçons grâce au système de commentaires modéré. L\'enseignant vous répond directement.',
            },
            {
              icon: <FontAwesomeIcon icon={faUsers} className="text-3xl text-green-400" />,
              title: '100% Gratuit',
              description: 'Un accès totalement gratuit et illimité à toutes les leçons et exercices. Apprendre l\'arabe n\'a jamais été aussi accessible.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-night-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DERNIÈRES LEÇONS ===== */}
      <section className="bg-white/5 border-y border-white/10">
        <div className="container-custom py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Dernières leçons publiées
              </h2>
              <p className="text-night-300">
                Commencez votre apprentissage avec nos leçons les plus récentes
              </p>
            </div>
            <Link
              href="/lecons"
              className="hidden md:flex items-center gap-3 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
            >
              Voir toutes les leçons
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-night-300">Chargement des leçons...</p>
            </div>
          ) : latestLessons.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faBookOpen} className="text-5xl text-night-700 mx-auto mb-4 opacity-20" />
              <p className="text-night-300 text-lg">
                Les leçons seront bientôt disponibles !
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lecons/${lesson.slug}`}
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-gold-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-900 to-night-900 flex items-center justify-center">
                    {lesson.imageUrl ? (
                      <img
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-gold-400/50" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {lesson.category && (
                        <span className="text-xs px-2 py-1 bg-gold-500/20 text-gold-300 rounded border border-gold-500/30">
                          {lesson.category.name}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded border ${getLevelBadgeColor(lesson.level)}`}>
                        {getLevelLabel(lesson.level)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-night-300 text-sm line-clamp-2">
                      {lesson.description || 'Découvrez cette leçon passionnante.'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/lecons"
              className="inline-flex items-center gap-3 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
            >
              Voir toutes les leçons
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRÉSENTATION ENSEIGNANT ===== */}
      <section className="container-custom py-20">
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
              Passionné par l'enseignement de l'arabe et du Coran depuis plusieurs années,
              j'ai créé cette plateforme pour partager mes connaissances et aider le plus
              grand nombre à maîtriser l'art de la lecture coranique.
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
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="border-t border-white/10 bg-gradient-to-r from-primary-950 to-night-900">
        <div className="container-custom py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-night-300 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez notre communauté d'apprenants et progressez à votre rythme.
            C'est gratuit et sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="w-full sm:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-600 text-night-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              S'inscrire gratuitement
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
            <Link
              href="/a-propos"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 flex items-center justify-center"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
