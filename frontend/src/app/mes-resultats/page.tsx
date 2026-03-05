'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAward,
  faChartLine,
  faCalendarAlt,
  faBullseye,
  faChevronRight,
  faFilter
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { pluralize, formatCount } from '@/utils/format'

export default function MesResultatsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'QCM' | 'OPEN_QUESTION'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date')

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/connexion')
      toast.error('Connectez-vous pour voir vos résultats')
      return
    }
    loadResults()
  }, [isAuthenticated])

  const loadResults = async () => {
    try {
      setLoading(true)
      const response = await api.get('/exercises/my-results')
      setResults(response.data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Impossible de charger les résultats')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer et trier
  const filteredResults = results
    .filter(r => filter === 'all' || r.exercise.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return (b.score || 0) - (a.score || 0)
      }
    })

  // Statistiques globales
  const stats = {
    total: results.length,
    qcm: results.filter(r => r.exercise.type === 'QCM').length,
    open: results.filter(r => r.exercise.type === 'OPEN_QUESTION').length,
    averageScore: results.filter(r => r.score !== null).length > 0
      ? Math.round(results.filter(r => r.score !== null).reduce((sum, r) => sum + (r.score || 0), 0) / results.filter(r => r.score !== null).length)
      : 0,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-night-300">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Mes Résultats</h1>
          <p className="text-night-300">Historique complet de vos exercices</p>
        </div>

        {/* Statistiques globales */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faAward} className="text-2xl text-primary-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-night-500">Total</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats.total}</div>
            <p className="text-night-400 text-sm">{pluralize(stats.total, 'Exercice')} faits</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faBullseye} className="text-2xl text-green-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-night-500">QCM</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats.qcm}</div>
            <p className="text-night-400 text-sm">Avec score</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-gold-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-night-500">Ouverts</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats.open}</div>
            <p className="text-night-400 text-sm">{pluralize(stats.open, 'Question')} libre{pluralize(stats.open, '', 's')}</p>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg shadow-primary-600/20">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faChartLine} className="text-2xl text-white/50" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">Moyenne</span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.averageScore}%</div>
            <p className="text-sm opacity-90">Score moyen</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faFilter} className="text-gold-400" />
              <span className="text-white font-bold uppercase tracking-wider text-sm">Filtrer :</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/10 text-night-300 hover:bg-white/20'
                  }`}
              >
                Tous ({stats.total})
              </button>
              <button
                onClick={() => setFilter('QCM')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'QCM'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-night-300 hover:bg-white/20'
                  }`}
              >
                QCM ({stats.qcm})
              </button>
              <button
                onClick={() => setFilter('OPEN_QUESTION')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'OPEN_QUESTION'
                  ? 'bg-gold-600 text-white'
                  : 'bg-white/10 text-night-300 hover:bg-white/20'
                  }`}
              >
                Ouverts ({stats.open})
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-night-400 text-sm">Trier par :</span>
              <button
                onClick={() => setSortBy('date')}
                className={`px-3 py-1 rounded text-sm font-semibold transition-all ${sortBy === 'date'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/10 text-night-300 hover:bg-white/20'
                  }`}
              >
                Date
              </button>
              <button
                onClick={() => setSortBy('score')}
                className={`px-3 py-1 rounded text-sm font-semibold transition-all ${sortBy === 'score'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/10 text-night-300 hover:bg-white/20'
                  }`}
              >
                Score
              </button>
            </div>
          </div>
        </div>

        {/* Liste des résultats */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faAward} className="text-5xl text-night-600 mx-auto mb-4" />
            <p className="text-night-300 text-lg mb-2">Aucun résultat trouvé</p>
            <p className="text-night-500 text-sm mb-8">Commencez par faire des exercices</p>
            <Link
              href="/lecons"
              className="inline-flex items-center gap-3 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20"
            >
              Voir les leçons
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result: any) => {
              const isQCM = result.exercise.type === 'QCM'
              const score = result.score
              const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-gold-400' : 'text-red-400'

              return (
                <div
                  key={result.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isQCM
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                          }`}>
                          {isQCM ? '✓ QCM' : '✍️ Ouvert'}
                        </span>
                        <span className="text-night-500 text-sm">
                          {new Date(result.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                        {result.exercise.title}
                      </h3>

                      {result.exercise.lesson && (
                        <p className="text-night-400 text-sm mb-3">
                          Leçon : {result.exercise.lesson.title}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-night-400">
                          {formatCount(result.exercise.questions?.length || 0, 'question')}
                        </span>
                        {isQCM && score !== null && (
                          <>
                            <span className="text-night-600">•</span>
                            <span className={`font-bold ${scoreColor}`}>
                              Score : {score}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Score visuel pour QCM */}
                    {isQCM && score !== null && (
                      <div className="text-right">
                        <div className={`text-5xl font-bold ${scoreColor} mb-1`}>
                          {score}%
                        </div>
                        <div className="text-night-500 text-xs">
                          {score >= 80 ? '🎉 Excellent' : score >= 60 ? '👍 Bien' : '💪 À revoir'}
                        </div>
                      </div>
                    )}

                    {/* Indicateur pour questions ouvertes */}
                    {!isQCM && (
                      <div className="text-right">
                        <div className="text-gold-400 text-3xl mb-1">✍️</div>
                        <div className="text-night-500 text-xs">
                          Réponse libre
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lien vers l'exercice */}
                  <Link
                    href={`/exercices/${result.exercise.id}`}
                    className="mt-4 inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-bold group"
                  >
                    Voir l'exercice
                    <FontAwesomeIcon icon={faChevronRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
