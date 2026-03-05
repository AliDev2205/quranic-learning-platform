'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen, faUsers, faMessage, faChartLine, faPlus, faGear, faLayerGroup, faAward
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { lessonsAPI, categoriesAPI, commentsAPI, api } from '@/lib/api'
import { toast } from 'sonner'
import { pluralize } from '@/utils/format'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    lessons: 0,
    categories: 0,
    pendingComments: 0,
    users: 0,
    exercises: 0,
  })

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/connexion')
      return
    }
    if (user?.role !== 'ADMIN') {
      router.push('/profil')
      toast.error('Accès non autorisé')
      return
    }
    loadStats()
  }, [isAuthenticated, user])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [lessonsRes, categoriesRes, commentsRes, usersRes, exercisesRes] = await Promise.all([
        lessonsAPI.getAll(),
        categoriesAPI.getAll(),
        commentsAPI.getPending(),
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/exercises').catch(() => ({ data: [] })),
      ])
      setStats({
        lessons: lessonsRes.data.length,
        categories: categoriesRes.data.length,
        pendingComments: commentsRes.data.length,
        users: usersRes.data.length,
        exercises: exercisesRes.data.length,
      })
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Erreur de chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-20">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tableau de bord Admin
          </h1>
          <p className="text-night-300">
            Gérez votre plateforme d'apprentissage coranique
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-night-300">Chargement...</p>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faBookOpen} className="text-xl text-primary-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-night-400">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1 font-heading">{stats.lessons}</div>
                <p className="text-night-400 text-xs font-medium">{pluralize(stats.lessons, 'Leçon')} publiées</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-xl text-gold-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-night-400">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1 font-heading">{stats.categories}</div>
                <p className="text-night-400 text-xs font-medium">{pluralize(stats.categories, 'Catégorie')}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faMessage} className="text-xl text-red-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold-400">Attention</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1 font-heading">{stats.pendingComments}</div>
                <p className="text-night-400 text-xs font-medium">{pluralize(stats.pendingComments, 'Message')} en attente</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faUsers} className="text-xl text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-night-400">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1 font-heading">{stats.users}</div>
                <p className="text-night-400 text-xs font-medium">{pluralize(stats.users, 'Utilisateur')} inscrits</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faAward} className="text-xl text-green-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-night-400">Total</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1 font-heading">{stats.exercises}</div>
                <p className="text-night-400 text-xs font-medium">{pluralize(stats.exercises, 'Exercice')} créés</p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/admin/lecons/nouvelle"
                className="group p-8 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-2xl transition-all shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <FontAwesomeIcon icon={faPlus} className="text-6xl text-white" />
                </div>
                <FontAwesomeIcon icon={faPlus} className="text-4xl text-white mb-6 group-hover:rotate-90 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  Créer une leçon
                </h3>
                <p className="text-primary-100 text-sm leading-relaxed">
                  Ajoutez une nouvelle leçon enrichie avec audio et vidéo à la plateforme
                </p>
              </Link>

              <Link
                href="/admin/lecons"
                className="group p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all backdrop-blur-sm shadow-xl"
              >
                <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  Gérer les leçons
                </h3>
                <p className="text-night-300 text-sm leading-relaxed">
                  Modifiez, organisez ou supprimez des leçons existantes
                </p>
              </Link>

              <Link
                href="/admin/categories"
                className="group p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all backdrop-blur-sm shadow-xl"
              >
                <FontAwesomeIcon icon={faLayerGroup} className="text-3xl text-primary-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  Catégories
                </h3>
                <p className="text-night-300 text-sm leading-relaxed">
                  Structurez vos contenus par thématiques et niveaux
                </p>
              </Link>

              <Link
                href="/admin/commentaires"
                className="group p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all backdrop-blur-sm shadow-xl relative"
              >
                <FontAwesomeIcon icon={faMessage} className="text-3xl text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  Commentaires
                  {stats.pendingComments > 0 && (
                    <span className="ml-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full animate-pulse shadow-lg shadow-red-500/20">
                      {stats.pendingComments}
                    </span>
                  )}
                </h3>
                <p className="text-night-300 text-sm leading-relaxed">
                  Modérez les échanges et répondez aux questions des apprenants
                </p>
              </Link>

              <Link
                href="/admin/exercices"
                className="group p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all backdrop-blur-sm shadow-xl"
              >
                <FontAwesomeIcon icon={faAward} className="text-3xl text-primary-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  Exercices
                </h3>
                <p className="text-night-300 text-sm leading-relaxed">
                  Gérez les QCM et les exercices de validation
                </p>
              </Link>

              <Link
                href="/admin/utilisateurs"
                className="group p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all backdrop-blur-sm shadow-xl"
              >
                <FontAwesomeIcon icon={faUsers} className="text-3xl text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2 font-heading">
                  Utilisateurs
                </h3>
                <p className="text-night-300 text-sm leading-relaxed">
                  Gérez les permissions et les accès des comptes utilisateurs
                </p>
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
