'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMessage, faCheck, faXmark, faTrashCan, faClock, faFilter, faReply, faUser, faBookOpen
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { commentsAPI } from '@/lib/api'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Comment {
  id: string
  content: string
  status: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  lesson: {
    id: string
    title: string
    slug: string
  }
}

export default function AdminCommentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; commentId: string | null }>({
    isOpen: false,
    commentId: null
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
    loadComments()
  }, [isAuthenticated, user, statusFilter])

  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await commentsAPI.getAll()
      setComments(response.data)
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Impossible de charger les commentaires')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (commentId: string, status: string) => {
    try {
      await commentsAPI.updateStatus(commentId, status)
      toast.success(
        status === 'APPROVED' ? 'Commentaire approuvé' : 'Commentaire rejeté'
      )
      loadComments()
    } catch (error) {
      console.error('Erreur de mise à jour:', error)
      toast.error('Impossible de modifier le commentaire')
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      await commentsAPI.delete(commentId)
      toast.success('Commentaire supprimé')
      loadComments()
    } catch (error) {
      console.error('Erreur de suppression:', error)
      toast.error('Impossible de supprimer le commentaire')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'REJECTED':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Approuvé'
      case 'REJECTED': return 'Rejeté'
      default: return 'En attente'
    }
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Modération des Commentaires
          </h1>
          <p className="text-night-300">
            Gérez les commentaires des apprenants
          </p>
        </div>

        {/* Filtre */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <FontAwesomeIcon icon={faFilter} className="text-primary-500" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 max-w-xs px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
            >
              <option value="PENDING" className="bg-night-800">En attente de modération</option>
              <option value="APPROVED" className="bg-night-800">Commentaires approuvés</option>
              <option value="REJECTED" className="bg-night-800">Commentaires rejetés</option>
            </select>
          </div>
        </div>

        {/* Liste des commentaires */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-night-300">Chargement...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm">
            <FontAwesomeIcon icon={faMessage} className="text-7xl text-night-700 mx-auto mb-8 opacity-20" />
            <p className="text-night-300 text-xl font-bold font-heading">
              {statusFilter === 'PENDING'
                ? 'Aucun commentaire en attente pour le moment'
                : 'Aucun commentaire ' + (statusFilter === 'APPROVED' ? 'approuvé' : 'rejeté')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments
              .filter(c => c.status === statusFilter)
              .map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all shadow-xl group"
                >
                  {/* En-tête du commentaire */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center font-black text-primary-400 font-heading border border-primary-500/30">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-white font-bold font-heading text-lg group-hover:text-primary-400 transition-colors">
                            {comment.user.name}
                          </span>
                          <span className="text-night-500 text-sm font-body">
                            {comment.user.email}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(comment.status)}`}>
                            {getStatusLabel(comment.status)}
                          </span>
                        </div>
                        <Link
                          href={`/lecons/${comment.lesson.slug}`}
                          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-xs font-black uppercase tracking-widest transition-colors"
                        >
                          <FontAwesomeIcon icon={faBookOpen} className="text-[10px]" />
                          {comment.lesson.title}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-night-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <FontAwesomeIcon icon={faClock} />
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Contenu du commentaire */}
                  <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/5 relative group-hover:bg-white/10 transition-colors">
                    <p className="text-night-100 leading-relaxed font-body italic">« {comment.content} »</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-4">
                    {comment.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(comment.id, 'APPROVED')}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-green-600/20"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          Approuver
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(comment.id, 'REJECTED')}
                          className="flex items-center gap-2 px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 rounded-xl transition-all shadow-lg shadow-red-600/5 group"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                          Rejeter
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, commentId: comment.id })}
                      className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-500/20 text-night-400 hover:text-red-400 border border-white/10 rounded-xl transition-all ml-auto"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Statistiques récapitulatives */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl group hover:bg-white/10 transition-colors">
            <p className="text-night-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-orange-500" />
              En attente
            </p>
            <p className="text-4xl font-bold text-orange-400 font-heading">
              {comments.filter(c => c.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl group hover:bg-white/10 transition-colors">
            <p className="text-night-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
              Approuvés
            </p>
            <p className="text-4xl font-bold text-green-400 font-heading">
              {comments.filter(c => c.status === 'APPROVED').length}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl group hover:bg-white/10 transition-colors">
            <p className="text-night-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faXmark} className="text-red-500" />
              Rejetés
            </p>
            <p className="text-4xl font-bold text-red-400 font-heading">
              {comments.filter(c => c.status === 'REJECTED').length}
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
        onConfirm={() => {
          if (deleteModal.commentId) {
            handleDelete(deleteModal.commentId)
          }
        }}
        title="Supprimer ce commentaire ?"
        message="Cette action est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        confirmColor="red"
      />
    </div>
  )
}
