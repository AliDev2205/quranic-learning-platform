'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookOpen, faPlus, faPenToSquare, faTrashCan, faEye, faSearch, faFilter, faCircleCheck, faCircleInfo, faImage, faMusic, faVideo, faCalendarDays
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { lessonsAPI, categoriesAPI, getMediaUrl } from '@/lib/api'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Lesson {
  id: string
  title: string
  slug: string
  description: string
  level: string
  status: string
  createdAt: string
  imageUrl: string | null
  audioUrl: string | null
  videoUrl: string | null
  category: {
    id: string
    name: string
  } | null
}

export default function AdminLessonsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; lessonId: string | null }>({
    isOpen: false,
    lessonId: null
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
    loadData()
  }, [isAuthenticated, user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [lessonsRes, categoriesRes] = await Promise.all([
        lessonsAPI.getAll(),
        categoriesAPI.getAll()
      ])
      setLessons(lessonsRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Erreur de chargement des leçons')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await lessonsAPI.delete(id)
      toast.success('Leçon supprimée avec succès')
      loadData()
    } catch (error) {
      console.error('Erreur de suppression:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'PUBLISHED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
          <FontAwesomeIcon icon={faCircleCheck} className="text-[8px]" />
          Publié
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
        <FontAwesomeIcon icon={faCircleInfo} className="text-[8px]" />
        Brouillon
      </span>
    )
  }

  const getLevelLabel = (level: string) => {
    const labels: any = {
      BEGINNER: 'Débutant',
      INTERMEDIATE: 'Intermédiaire',
      ADVANCED: 'Avancé'
    }
    return labels[level] || level
  }

  // Filtrage
  const filteredLessons = lessons.filter(lesson => {
    const matchCategory = !selectedCategory || lesson.category?.id === selectedCategory
    const matchStatus = !selectedStatus || lesson.status === selectedStatus
    const matchSearch = !searchQuery ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchCategory && matchStatus && matchSearch
  })

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gestion des Leçons</h1>
            <p className="text-night-300">
              {filteredLessons.length} leçon{filteredLessons.length > 1 ? 's' : ''} {searchQuery || selectedCategory || selectedStatus ? 'trouvée(s)' : 'au total'}
            </p>
          </div>
          <Link
            href="/admin/lecons/nouvelle"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-night-950 font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg shadow-gold-500/20 group"
          >
            <FontAwesomeIcon icon={faPlus} className="group-hover:rotate-90 transition-transform" />
            Nouvelle leçon
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} className="text-primary-500" />
                Rechercher une leçon
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titre, mots-clés ou description..."
                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-gold-500" />
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm appearance-none"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-night-800">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">Statut de publication</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="PUBLISHED" className="bg-night-800">Publié</option>
                <option value="DRAFT" className="bg-night-800">Brouillon</option>
              </select>
            </div>
          </div>

          {/* Bouton reset */}
          {(searchQuery || selectedCategory || selectedStatus) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
                setSelectedStatus('')
              }}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Liste des leçons */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-night-300">Chargement...</p>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm">
            <FontAwesomeIcon icon={faBookOpen} className="text-7xl text-night-700 mx-auto mb-8 opacity-20" />
            <p className="text-night-300 text-xl font-bold mb-4 font-heading">Aucune leçon ne correspond à vos critères</p>
            <Link
              href="/admin/lecons/nouvelle"
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary-500/20"
            >
              <FontAwesomeIcon icon={faPlus} />
              Créer la première leçon
            </Link>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left px-6 py-4 text-white font-semibold">Leçon</th>
                    <th className="text-left px-6 py-4 text-white font-semibold hidden md:table-cell">Catégorie</th>
                    <th className="text-left px-6 py-4 text-white font-semibold hidden lg:table-cell">Niveau</th>
                    <th className="text-left px-6 py-4 text-white font-semibold">Statut</th>
                    <th className="text-left px-6 py-4 text-white font-semibold hidden xl:table-cell">Médias</th>
                    <th className="text-left px-6 py-4 text-white font-semibold hidden lg:table-cell">Date</th>
                    <th className="text-right px-6 py-4 text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.map((lesson) => (
                    <tr key={lesson.id} className="border-b border-white/5 hover:bg-white/10 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          {lesson.imageUrl ? (
                            <img
                              src={getMediaUrl(lesson.imageUrl)}
                              alt={lesson.title}
                              className="w-14 h-14 object-cover rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                              <FontAwesomeIcon icon={faImage} className="text-night-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-white font-bold font-heading group-hover:text-primary-400 transition-colors leading-tight">{lesson.title}</p>
                            {lesson.description && (
                              <p className="text-night-400 text-xs mt-1 line-clamp-1 max-w-xs font-body">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {lesson.category ? (
                          <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-night-300 border border-white/5">
                            {lesson.category.name}
                          </span>
                        ) : (
                          <span className="text-night-600 text-[10px] font-black uppercase tracking-widest italic">Aucune</span>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-night-400 text-xs font-medium">
                          {getLevelLabel(lesson.level)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(lesson.status)}
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon
                            icon={faImage}
                            className={`text-xs ${lesson.imageUrl ? 'text-primary-400' : 'text-night-700'}`}
                            title="Image"
                          />
                          <FontAwesomeIcon
                            icon={faMusic}
                            className={`text-xs ${lesson.audioUrl ? 'text-gold-400' : 'text-night-700'}`}
                            title="Audio"
                          />
                          <FontAwesomeIcon
                            icon={faVideo}
                            className={`text-xs ${lesson.videoUrl ? 'text-red-400' : 'text-night-700'}`}
                            title="Vidéo"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-night-400 text-xs font-medium">
                          <FontAwesomeIcon icon={faCalendarDays} className="text-[10px] text-night-600" />
                          {new Date(lesson.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/lecons/${lesson.slug}`}
                            target="_blank"
                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-primary-500 text-night-400 hover:text-white rounded-xl transition-all shadow-lg"
                            title="Aperçu public"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-sm" />
                          </Link>
                          <Link
                            href={`/admin/lecons/${lesson.id}/modifier`}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-gold-500 text-night-400 hover:text-white rounded-xl transition-all shadow-lg"
                            title="Modifier"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, lessonId: lesson.id })}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500 text-night-400 hover:text-white rounded-xl transition-all shadow-lg"
                            title="Supprimer"
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, lessonId: null })}
        onConfirm={() => {
          if (deleteModal.lessonId) {
            handleDelete(deleteModal.lessonId)
            setDeleteModal({ isOpen: false, lessonId: null })
          }
        }}
        title="Supprimer cette leçon ?"
        message="Cette action est irréversible. Tous les exercices et commentaires associés seront également supprimés."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        confirmColor="red"
      />
    </div>
  )
}
