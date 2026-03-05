'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen,
  faArrowLeft,
  faClock,
  faTag,
  faHeart,
  faComments,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { lessonsAPI, favoritesAPI, progressAPI, commentsAPI, api, getMediaUrl } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { pluralize, formatCount } from '@/utils/format'

interface Lesson {
  id: string
  title: string
  content: string
  description: string
  level: string
  imageUrl: string | null
  audioUrl: string | null
  videoUrl: string | null
  createdAt: string
  category: {
    id: string
    name: string
  } | null
  exercises: any[]
  comments: any[]
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user, isAuthenticated } = useAuthStore()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [loadingAction, setLoadingAction] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    loadLesson()
  }, [slug])

  useEffect(() => {
    if (lesson) {
      loadComments()
      if (isAuthenticated) {
        loadFavoriteStatus()
        loadProgress()
      }
    }
  }, [lesson, isAuthenticated])

  const loadLesson = async () => {
    try {
      setLoading(true)
      const response = await lessonsAPI.getBySlug(slug)
      setLesson(response.data)
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Leçon introuvable')
    } finally {
      setLoading(false)
    }
  }

  const loadFavoriteStatus = async () => {
    if (!lesson || !isAuthenticated) return

    try {
      const response = await favoritesAPI.check(lesson.id)
      setIsFavorite(response.data.isFavorite)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const loadProgress = async () => {
    if (!lesson || !isAuthenticated) return

    try {
      const response = await progressAPI.getByLesson(lesson.id)
      if (response.data) {
        // Utiliser le pourcentage calculé par le backend
        setProgressPercentage(response.data.progressPercentage || 0)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const loadComments = async () => {
    if (!lesson) return
    try {
      const response = await commentsAPI.getByLesson(lesson.id)
      setComments(response.data)
    } catch (error) {
      console.error('Erreur chargement commentaires:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !lesson) return
    try {
      setSubmittingComment(true)
      await commentsAPI.create(lesson.id, newComment)
      setNewComment('')
      toast.success('Commentaire envoyé ! Il sera visible après modération.')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi du commentaire')
    } finally {
      setSubmittingComment(false)
    }
  }

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris')
      return
    }

    if (!lesson) return

    try {
      setLoadingAction(true)

      if (isFavorite) {
        await favoritesAPI.remove(lesson.id)
        setIsFavorite(false)
        toast.success('Retiré des favoris')
      } else {
        await favoritesAPI.add(lesson.id)
        setIsFavorite(true)
        toast.success('✅ Ajouté aux favoris')
      }
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(error.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoadingAction(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-night-300">Chargement de la leçon...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
        <Header />
        <div className="container-custom py-20 text-center">
          <FontAwesomeIcon icon={faBookOpen} className="text-5xl text-night-700 mx-auto mb-4 opacity-20" />
          <h1 className="text-2xl font-bold text-white mb-4">Leçon introuvable</h1>
          <Link href="/lecons" className="text-gold-400 hover:text-gold-300">
            Retour aux leçons
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-8 transition-colors cursor-pointer group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              {/* En-tête */}
              <div className="mb-8">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {lesson.category && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full border border-gold-500/30 text-sm">
                      <FontAwesomeIcon icon={faTag} className="text-xs" />
                      {lesson.category.name}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30 text-sm">
                    {lesson.level === 'BEGINNER' ? 'Débutant' : lesson.level === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'}
                  </span>
                </div>

                {/* Titre */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-amiri">
                  {lesson.title}
                </h1>

                {/* Description */}
                {lesson.description && (
                  <p className="text-xl text-night-300 mb-4">
                    {lesson.description}
                  </p>
                )}

                {/* Métadonnées */}
                <div className="flex flex-wrap items-center gap-6 text-night-400 text-sm">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-primary-400" />
                    <span>
                      {new Date(lesson.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faComments} className="text-gold-400" />
                    <span>{formatCount(lesson.comments.length, 'commentaire')}</span>
                  </div>
                </div>
              </div>

              {/* Image principale */}
              {lesson.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={getMediaUrl(lesson.imageUrl)}
                    alt={lesson.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Vidéo */}
              {lesson.videoUrl && (
                <div className="mb-8 aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Audio */}
              {lesson.audioUrl && (
                <div className="mb-8 p-4 bg-white/10 rounded-xl">
                  <audio controls className="w-full">
                    <source src={getMediaUrl(lesson.audioUrl)} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* Contenu de la leçon */}
              <div className="mb-8">
                <div className="p-8 bg-white/5 rounded-xl border border-white/10">
                  <style jsx>{`
                    .lesson-content {
                      color: #f3f4f6 !important;
                      font-size: 1.125rem;
                      line-height: 1.8;
                    }
                    .lesson-content * {
                      color: #f3f4f6 !important;
                    }
                    .lesson-content p {
                      margin-bottom: 1rem;
                    }
                    .lesson-content strong {
                      color: #fbbf24 !important;
                      font-weight: 700;
                    }
                    .lesson-content em {
                      color: #86efac !important;
                    }
                  `}</style>
                  <div
                    className="lesson-content"
                    dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }}
                  />
                </div>
              </div>

              {/* Exercices */}
              {lesson.exercises.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Exercices pratiques
                  </h2>
                  <div className="space-y-4">
                    {lesson.exercises.map((exercise) => (
                      <Link
                        key={exercise.id}
                        href={`/exercices/${exercise.id}`}
                        className="block p-6 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-xl transition-all"
                      >
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {exercise.title}
                        </h3>
                        {exercise.description && (
                          <p className="text-night-300 text-sm">
                            {exercise.description}
                          </p>
                        )}
                        <span className="inline-block mt-2 text-primary-400 text-sm">
                          {exercise.type === 'QCM' ? 'QCM' : 'Question ouverte'} • {formatCount(exercise.questions.length, 'question')}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Commentaires */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FontAwesomeIcon icon={faComments} className="text-gold-400" />
                  Commentaires
                  <span className="text-sm font-normal text-night-400 ml-1">({formatCount(comments.length, 'commentaire')})</span>
                </h2>

                {/* Formulaire de commentaire */}
                {isAuthenticated ? (
                  <form onSubmit={handleSubmitComment} className="mb-8">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      placeholder="Posez une question ou laissez un commentaire..."
                      required
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-night-500 text-xs">
                        Votre commentaire sera visible après modération.
                      </p>
                      <button
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                      >
                        {submittingComment ? 'Envoi...' : 'Publier'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                    <p className="text-night-300 mb-2">Connectez-vous pour laisser un commentaire</p>
                    <a href="/connexion" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                      Se connecter
                    </a>
                  </div>
                )}

                {/* Liste des commentaires */}
                {comments.length === 0 ? (
                  <p className="text-night-400 text-center py-8">
                    Aucun commentaire pour l'instant. Soyez le premier à commenter !
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {comment.user?.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <span className="text-white font-semibold text-sm">
                              {comment.user?.name || 'Utilisateur'}
                            </span>
                          </div>
                          <span className="text-night-500 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-night-300 leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={toggleFavorite}
                    disabled={loadingAction}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 font-bold rounded-xl transition-all ${isFavorite
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20'
                      } disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'text-white' : 'text-white/50'} />
                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </button>
                </div>
              </div>

              {/* Progression */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Votre progression</h3>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold mb-2 ${progressPercentage === 100 ? 'text-green-400' : 'text-gold-400'
                    }`}>
                    {progressPercentage}%
                  </div>
                  <p className="text-night-400 text-sm">de cette leçon</p>
                </div>

                {/* Barre de progression */}
                <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${progressPercentage === 100
                      ? 'bg-gradient-to-r from-green-600 to-green-400'
                      : 'bg-gradient-to-r from-gold-600 to-gold-400'
                      }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Message de félicitations si 100% */}
                {progressPercentage === 100 && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-5 mb-4 shadow-inner shadow-green-500/5">
                    <div className="flex items-center gap-3 text-green-400 mb-2">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
                      <span className="font-bold text-lg">Leçon terminée !</span>
                    </div>
                    <p className="text-green-300 text-sm">
                      🎉 Félicitations ! Vous avez complété tous les exercices de cette leçon.
                    </p>
                  </div>
                )}

                {/* Détails */}
                <div className="space-y-2 text-sm">
                  {lesson && lesson.exercises && lesson.exercises.length > 0 && (
                    <div className="flex items-center justify-between text-night-400">
                      <span>Exercices</span>
                      <span className="font-semibold text-white">
                        {lesson.exercises.length}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-night-400">
                    <span>Statut</span>
                    <span className={`font-semibold ${progressPercentage === 100 ? 'text-green-400' : 'text-gold-400'
                      }`}>
                      {progressPercentage === 100 ? 'Terminée ✓' : 'En cours'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
