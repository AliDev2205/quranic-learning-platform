'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine, faBookOpen, faAward, faBullseye, faCircleCheck, faClock, faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { progressAPI } from '@/lib/api'
import { toast } from 'sonner'
import { pluralize, formatCount } from '@/utils/format'

export default function ProgressionPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/connexion')
      toast.error('Connectez-vous pour voir votre progression')
      return
    }
    loadProgress()
  }, [isAuthenticated])

  const loadProgress = async () => {
    try {
      setLoading(true)
      const response = await progressAPI.getMyProgress()
      setData(response.data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Impossible de charger la progression')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900 font-body">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4 shadow-lg shadow-primary-500/20"></div>
          <p className="text-night-300">Chargement de votre parcours...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const stats = data.statistics

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900 font-body">
      <Header />

      <div className="container-custom py-12">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 font-heading">Ma Progression</h1>
          <p className="text-night-300">Suivez votre parcours d'apprentissage et célébrez vos succès</p>
        </div>

        {/* Statistiques globales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Progression globale */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-600/20 group hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faChartLine} className="text-2xl opacity-80" />
              <span className="text-xs uppercase tracking-wider font-bold opacity-70">Global</span>
            </div>
            <div className="text-4xl font-bold mb-2 font-heading">{stats.percentage}%</div>
            <p className="text-sm opacity-90">Progression totale</p>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>

          {/* Leçons terminées */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-gold-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-night-400 font-bold uppercase tracking-wider">Total</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2 font-heading">
              {stats.completedLessons}
            </div>
            <p className="text-night-400 text-sm">
              sur {formatCount(stats.totalLessons, 'leçon')}
            </p>
          </div>

          {/* Exercices complétés */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faAward} className="text-2xl text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-night-400 font-bold uppercase tracking-wider">Complétés</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2 font-heading">
              {stats.completedExercises}
            </div>
            <p className="text-night-400 text-sm">
              sur {formatCount(stats.totalExercises, 'exercice')}
            </p>
          </div>

          {/* Score moyen */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <FontAwesomeIcon icon={faBullseye} className="text-2xl text-primary-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-night-400 font-bold uppercase tracking-wider">Moyenne</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2 font-heading">
              {stats.averageScore}%
            </div>
            <p className="text-night-400 text-sm">Score moyen global</p>
          </div>
        </div>

        {/* Liste des leçons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 font-heading border-l-4 border-primary-500 pl-4">Mes Leçons</h2>

          {data.progress.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed">
              <FontAwesomeIcon icon={faBookOpen} className="text-6xl text-night-700 mx-auto mb-6 opacity-20" />
              <p className="text-night-300 text-xl font-bold mb-2">Aucune leçon commencée</p>
              <p className="text-night-500 mb-8">Commencez votre voyage d'apprentissage dès maintenant</p>
              <Link
                href="/lecons"
                className="inline-flex items-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:scale-105 active:scale-95"
              >
                Découvrir les leçons
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {data.progress.map((item: any) => {
                const percentage = item.progressPercentage || 0
                const isCompleted = item.status === 'COMPLETED'

                return (
                  <Link
                    key={item.id}
                    href={`/lecons/${item.lesson.slug}`}
                    className="block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group shadow-lg hover:shadow-primary-500/5"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors font-heading">
                            {item.lesson.title}
                          </h3>
                          {isCompleted && (
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full border border-green-500/30 shadow-inner">
                              <FontAwesomeIcon icon={faCircleCheck} className="text-green-400" />
                            </div>
                          )}
                        </div>
                        {item.lesson.category && (
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-night-300 border border-white/5">
                              {item.lesson.category.name}
                            </span>
                            <span className="text-night-500 text-sm">•</span>
                            <span className="text-night-400 text-sm font-medium">
                              {
                                item.lesson.level === 'BEGINNER' ? 'Débutant' :
                                  item.lesson.level === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                        <div className={`text-4xl font-bold font-heading ${percentage === 100 ? 'text-green-400' : 'text-gold-400'
                          }`}>
                          {percentage}<span className="text-lg opacity-60 ml-0.5">%</span>
                        </div>
                        <p className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-gold-500/20 text-gold-400 border border-gold-500/20'
                          }`}>
                          {isCompleted ? 'Terminée' : 'En cours'}
                        </p>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${percentage === 100
                          ? 'bg-gradient-to-r from-green-600 to-green-400'
                          : 'bg-gradient-to-r from-gold-600 to-gold-400'
                          }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Détails */}
                    {item.totalExercises > 0 && (
                      <div className="mt-5 flex items-center gap-6 text-sm text-night-400 font-medium">
                        <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg">
                          {item.completedExercises || 0}/{formatCount(item.totalExercises, 'exercice')}
                        </span>
                        {item.updatedAt && (
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="text-primary-400" />
                            Dernière activité le {new Date(item.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Encouragement */}
        {stats.percentage < 100 && (
          <div className="bg-gradient-to-br from-primary-600/20 via-gold-500/10 to-primary-600/20 border border-white/10 backdrop-blur-md rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-500"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/10 border border-white/5">
                <FontAwesomeIcon icon={faChartLine} className="text-3xl text-primary-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 font-heading">
                Continuez votre apprentissage !
              </h3>
              <p className="text-night-300 mb-8 max-w-lg mx-auto leading-relaxed">
                Vous avez déjà complété <span className="text-primary-400 font-bold">{stats.percentage}%</span> de votre parcours. La régularité est la clé de la réussite !
              </p>
              <Link
                href="/lecons"
                className="inline-flex items-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:scale-105 active:scale-95 group"
              >
                Continuer les leçons
                <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* Félicitations si 100% */}
        {stats.percentage === 100 && (
          <div className="bg-gradient-to-br from-green-500/20 via-primary-500/10 to-green-500/20 border border-green-500/20 backdrop-blur-md rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0%,transparent_70%)]"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/20 border border-green-500/30">
                <FontAwesomeIcon icon={faAward} className="text-5xl text-green-400" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 font-heading">
                Macha'Allah ! Félicitations !
              </h3>
              <p className="text-night-300 text-xl leading-relaxed max-w-xl mx-auto">
                Vous avez terminé l'ensemble des leçons disponibles. Votre persévérance a porté ses fruits !
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
