'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faEnvelope, faCalendarDay, faAward, faChartLine, faClock,
  faHeart, faBookOpen, faCircleCheck, faBullseye, faChevronRight, faCrown, faGraduationCap,
  faMessage, faUsers, faPlus, faLayerGroup
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { api, lessonsAPI, commentsAPI } from '@/lib/api'
import { toast } from 'sonner'
import { pluralize } from '@/utils/format'

export default function ProfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [adminStats, setAdminStats] = useState({
    lessons: 0,
    pendingComments: 0,
    users: 0
  })

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/connexion')
      return
    }
    if (user?.role === 'ADMIN') {
      loadAdminProfileData()
    } else {
      loadProfileData()
    }
  }, [isAuthenticated, user])

  const loadAdminProfileData = async () => {
    try {
      setLoading(true)
      const [lessonsRes, commentsRes, usersRes] = await Promise.all([
        lessonsAPI.getAll(),
        commentsAPI.getPending(),
        api.get('/users').catch(() => ({ data: [] }))
      ])

      setAdminStats({
        lessons: lessonsRes.data.length,
        pendingComments: commentsRes.data.length,
        users: usersRes.data.length
      })
    } catch (error) {
      console.error('Erreur chargement profil admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfileData = async () => {
    try {
      setLoading(true)

      // Charger les statistiques
      try {
        const statsRes = await api.get('/progress/my-progress')
        setStats(statsRes.data.statistics)
      } catch (error) {
        console.error('Erreur stats:', error)
      }

      // Charger les résultats récents
      try {
        const resultsRes = await api.get('/exercises/my-results')
        console.log('Résultats chargés:', resultsRes.data)
        setRecentActivity(resultsRes.data.slice(0, 5))
      } catch (error) {
        console.error('Erreur résultats:', error)
      }

      // Charger les favoris
      try {
        const favRes = await api.get('/favorites')
        console.log('Favoris chargés:', favRes.data)
        setFavorites(favRes.data)
      } catch (error) {
        console.error('Erreur favoris:', error)
      }
    } catch (error: any) {
      console.error('Erreur chargement profil:', error)
      toast.error('Impossible de charger le profil')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Récemment'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Récemment'
      return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    } catch {
      return 'Récemment'
    }
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
        {/* En-tête du profil */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center border-4 border-primary-500 shadow-xl shadow-primary-900/40">
              <FontAwesomeIcon icon={faUser} className="text-5xl text-white" />
            </div>

            {/* Informations */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2 font-heading">{user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-night-300 mb-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary-400" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarDay} className="text-gold-400" />
                  <span>Membre depuis {formatDate(user?.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Rôle */}
            <div className="px-6 py-3 bg-gold-500/10 border border-gold-500/30 rounded-xl">
              <span className="text-gold-400 font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={user?.role === 'ADMIN' ? faCrown : faGraduationCap} />
                {user?.role === 'ADMIN' ? 'Administrateur' : 'Apprenant'}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu spécifique au rôle */}
        {user?.role === 'ADMIN' ? (
          <div className="space-y-8">
            {/* Statistiques Admin */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/admin/lecons" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faBookOpen} className="text-xl text-primary-400" />
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-night-500 group-hover:text-primary-400 transition-colors" />
                </div>
                <div className="text-4xl font-bold text-white mb-1 font-heading">{adminStats.lessons}</div>
                <p className="text-night-400 font-medium">{pluralize(adminStats.lessons, 'Leçon')} gérée{(adminStats.lessons > 1) ? 's' : ''}</p>
              </Link>

              <Link href="/admin/commentaires" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faMessage} className="text-xl text-gold-400" />
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-night-500 group-hover:text-gold-400 transition-colors" />
                </div>
                <div className="text-4xl font-bold text-white mb-1 font-heading">{adminStats.pendingComments}</div>
                <p className="text-night-400 font-medium">{pluralize(adminStats.pendingComments, 'Commentaire')} en attente</p>
              </Link>

              <Link href="/admin/utilisateurs" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faUsers} className="text-xl text-green-400" />
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="text-night-500 group-hover:text-green-400 transition-colors" />
                </div>
                <div className="text-4xl font-bold text-white mb-1 font-heading">{adminStats.users}</div>
                <p className="text-night-400 font-medium">{pluralize(adminStats.users, 'Utilisateur')} inscrit{(adminStats.users > 1) ? 's' : ''}</p>
              </Link>
            </div>

            {/* Actions rapides */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FontAwesomeIcon icon={faBullseye} className="text-primary-400" />
                Actions de Gestion
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/lecons/nouvelle" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-primary-500/10 hover:border-primary-500/30 transition-all text-center group">
                  <FontAwesomeIcon icon={faPlus} className="text-2xl text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-bold block">Nouvelle leçon</p>
                </Link>
                <Link href="/admin/categories" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-gold-500/10 hover:border-gold-500/30 transition-all text-center group">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-2xl text-gold-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-bold block">Catégories</p>
                </Link>
                <Link href="/admin/exercices" className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-green-500/10 hover:border-green-500/30 transition-all text-center group">
                  <FontAwesomeIcon icon={faAward} className="text-2xl text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-bold block">Exercices</p>
                </Link>
                <Link href="/admin" className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all text-center shadow-lg group">
                  <FontAwesomeIcon icon={faChartLine} className="text-2xl text-white mb-3 group-hover:translate-x-1 transition-transform" />
                  <p className="text-white font-bold block">Dashboard Complet</p>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Statistiques Apprenant */}
            {stats && (
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all">
                  <FontAwesomeIcon icon={faChartLine} className="text-2xl text-primary-400 mb-4" />
                  <div className="text-4xl font-bold text-white mb-1">{stats.percentage || 0}%</div>
                  <p className="text-night-400 text-sm">Progression globale</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-2xl text-green-400 mb-4" />
                  <div className="text-4xl font-bold text-white mb-1">{stats.completedLessons || 0}</div>
                  <p className="text-night-400 text-sm">Leçons terminées</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all">
                  <FontAwesomeIcon icon={faBullseye} className="text-2xl text-gold-400 mb-4" />
                  <div className="text-4xl font-bold text-white mb-1">{stats.completedExercises || 0}</div>
                  <p className="text-night-400 text-sm">Exercices complétés</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group hover:bg-white/10 transition-all">
                  <FontAwesomeIcon icon={faAward} className="text-2xl text-gold-400 mb-4" />
                  <div className="text-4xl font-bold text-white mb-1">{stats.averageScore || 0}%</div>
                  <p className="text-night-400 text-sm">Score moyen</p>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Activité récente */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FontAwesomeIcon icon={faClock} className="text-primary-400" />
                  Activité récente
                </h2>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-night-400 mb-4">Aucune activité récente</p>
                    <Link
                      href="/exercices"
                      className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Commencer un exercice
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity: any) => (
                      <div
                        key={activity.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">
                              {activity.exercise?.title || 'Exercice'}
                            </h3>
                            <p className="text-night-400 text-sm mb-2">
                              {activity.exercise?.lesson?.title || 'Leçon'}
                            </p>
                            <span className="text-xs text-night-500">
                              {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {activity.score !== null && activity.score !== undefined && (
                            <div className={`text-2xl font-bold ${activity.score >= 80 ? 'text-green-400' :
                              activity.score >= 60 ? 'text-gold-400' : 'text-red-400'
                              }`}>
                              {activity.score}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/mes-resultats"
                  className="mt-6 block text-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
                >
                  Voir tout l'historique
                </Link>
              </div>

              {/* Favoris */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                  Leçons favorites
                </h2>

                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-night-400 mb-4">Aucune leçon favorite</p>
                    <Link
                      href="/lecons"
                      className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Explorer les leçons
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favorites.slice(0, 5).map((fav: any) => (
                      <Link
                        key={fav.id}
                        href={`/lecons/${fav.lesson?.slug || ''}`}
                        className="block bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBookOpen} className="text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">
                              {fav.lesson?.title || 'Leçon'}
                            </h3>
                            <p className="text-night-400 text-xs">
                              {fav.lesson?.category?.name || 'Catégorie'}
                            </p>
                          </div>
                          {fav.lesson?.level && (
                            <div className="text-right">
                              <span className="text-gold-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-gold-500/30 rounded-full">
                                {fav.lesson.level}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  href="/lecons"
                  className="mt-6 block text-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
                >
                  Explorer les leçons
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
