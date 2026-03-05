'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAward, faBookOpen, faChevronRight, faFilter, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { lessonsAPI } from '@/lib/api'
import { toast } from 'sonner'
import { pluralize, formatCount } from '@/utils/format'

interface Exercise {
  id: string
  title: string
  type: string
  questions: any[]
}

interface Lesson {
  id: string
  title: string
  slug: string
  level: string
  exercises: Exercise[]
  category: { id: string; name: string } | null
}

export default function ExercicesPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLevel, setFilterLevel] = useState<string>('all')

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      const response = await lessonsAPI.getPublished()
      // Garder uniquement les leçons qui ont des exercices
      const lessonsWithExercises = response.data.filter(
        (l: Lesson) => l.exercises && l.exercises.length > 0
      )
      setLessons(lessonsWithExercises)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Impossible de charger les exercices')
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

  const filteredLessons = filterLevel === 'all'
    ? lessons
    : lessons.filter(l => l.level === filterLevel)

  const totalExercises = filteredLessons.reduce(
    (acc, l) => acc + (l.exercises?.length || 0), 0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12 animate-fade-in">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Exercices</h1>
          <p className="text-night-300">
            Renforcez vos acquis avec des QCM et des questions ouvertes
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
            <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faAward} className="text-3xl text-gold-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalExercises}</div>
            <p className="text-night-400 text-sm">{pluralize(totalExercises, 'Exercice')} disponibles</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
            <div className="w-10 h-10 flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-primary-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{filteredLessons.length}</div>
            <p className="text-night-400 text-sm">{pluralize(filteredLessons.length, 'Leçon')} avec exercices</p>
          </div>
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-center shadow-lg shadow-primary-600/20">
            <FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-white/50 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">2 types</div>
            <p className="text-primary-100 text-sm">QCM + Questions ouvertes</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faFilter} className="text-gold-400" />
              <span className="text-white font-bold text-sm tracking-wide uppercase">Niveau :</span>
            </div>
            {[
              { value: 'all', label: 'Tous' },
              { value: 'BEGINNER', label: 'Débutant' },
              { value: 'INTERMEDIATE', label: 'Intermédiaire' },
              { value: 'ADVANCED', label: 'Avancé' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterLevel(option.value)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${filterLevel === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/10 text-night-300 hover:bg-white/20'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-night-300">Chargement des exercices...</p>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 animate-fade-in shadow-xl">
            <div className="w-20 h-20 bg-night-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <FontAwesomeIcon icon={faAward} className="text-3xl text-night-600 opacity-50" />
            </div>
            <p className="text-white text-xl font-bold mb-2">Aucun exercice disponible</p>
            <p className="text-night-400 text-base mb-8 max-w-md mx-auto">
              {filterLevel === 'all'
                ? "Nous préparons actuellement de nouveaux exercices pour vous. Revenez bientôt !"
                : `Il n'y a pas encore d'exercices pour le niveau ${getLevelLabel(filterLevel).toLowerCase()}.`}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/lecons"
                className="inline-flex items-center gap-3 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20"
              >
                Explorer les leçons
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
              </Link>
              {filterLevel !== 'all' && (
                <button
                  onClick={() => setFilterLevel('all')}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10"
                >
                  Voir tous les niveaux
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
                      <span className={`text-xs px-2 py-1 rounded border ${getLevelBadgeColor(lesson.level)}`}>
                        {getLevelLabel(lesson.level)}
                      </span>
                    </div>
                    {lesson.category && (
                      <p className="text-night-400 text-sm">{lesson.category.name}</p>
                    )}
                  </div>
                  <Link
                    href={`/lecons/${lesson.slug}`}
                    className="text-primary-400 hover:text-primary-300 text-sm font-bold flex items-center gap-2 transition-colors group"
                  >
                    Voir la leçon
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lesson.exercises.map((exercise) => (
                    <Link
                      key={exercise.id}
                      href={`/exercices/${exercise.id}`}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-500/30 rounded-xl p-4 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${exercise.type === 'QCM'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                          }`}>
                          {exercise.type === 'QCM' ? '✓ QCM' : '✍️ Ouvert'}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold group-hover:text-gold-300 transition-colors text-sm">
                        {exercise.title}
                      </h3>
                      <p className="text-night-500 text-xs mt-1">
                        {formatCount(exercise.questions?.length || 0, 'question')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
