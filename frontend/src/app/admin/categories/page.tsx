'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faPenToSquare, faTrashCan, faFloppyDisk, faXmark, faLayerGroup, faBookOpen
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { categoriesAPI } from '@/lib/api'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  order: number
  _count: {
    lessons: number
  }
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState<{ id: string | null; isNew: boolean }>({
    id: null,
    isNew: false
  })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order: 0
  })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoryId: string | null }>({
    isOpen: false,
    categoryId: null
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
    loadCategories()
  }, [isAuthenticated, user])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoriesAPI.getAll()
      setCategories(response.data)
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Impossible de charger les catégories')
    } finally {
      setLoading(false)
    }
  }

  const startCreate = () => {
    setFormData({ name: '', description: '', order: categories.length })
    setEditMode({ id: null, isNew: true })
  }

  const startEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      order: category.order
    })
    setEditMode({ id: category.id, isNew: false })
  }

  const cancelEdit = () => {
    setFormData({ name: '', description: '', order: 0 })
    setEditMode({ id: null, isNew: false })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Le nom est requis')
      return
    }

    try {
      if (editMode.isNew) {
        await categoriesAPI.create(formData)
        toast.success('Catégorie créée avec succès')
      } else if (editMode.id) {
        await categoriesAPI.update(editMode.id, formData)
        toast.success('Catégorie modifiée avec succès')
      }

      cancelEdit()
      loadCategories()
    } catch (error: any) {
      console.error('Erreur de sauvegarde:', error)
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await categoriesAPI.delete(id)
      toast.success('Catégorie supprimée avec succès')
      loadCategories()
    } catch (error) {
      console.error('Erreur de suppression:', error)
      toast.error('Impossible de supprimer la catégorie')
    }
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Gestion des Catégories
            </h1>
            <p className="text-night-300">
              Organisez vos leçons par catégories
            </p>
          </div>
          {!editMode.isNew && (
            <button
              onClick={startCreate}
              className="flex items-center gap-3 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary-500/20 group"
            >
              <FontAwesomeIcon icon={faPlus} className="group-hover:rotate-90 transition-transform" />
              Nouvelle catégorie
            </button>
          )}
        </div>

        {/* Formulaire de création/édition */}
        {(editMode.isNew || editMode.id) && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editMode.isNew ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
              </h2>
              <button
                onClick={cancelEdit}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xl text-night-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">
                    Nom de la catégorie <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
                    placeholder="Ex: Tajweed, Hifz, Prononciation..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">Description pédagogique</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm resize-none"
                  placeholder="Décrivez les objectifs de cette thématique..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-3 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary-500/20"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des catégories */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-night-300">Chargement...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm">
            <FontAwesomeIcon icon={faLayerGroup} className="text-7xl text-night-700 mx-auto mb-8 opacity-20" />
            <p className="text-night-300 text-xl font-bold mb-8 font-heading">Aucune catégorie n'est encore enregistrée</p>
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary-500/20"
            >
              <FontAwesomeIcon icon={faPlus} />
              Créer la première catégorie
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group shadow-xl hover:shadow-primary-500/5 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-500/5 rounded-full group-hover:bg-primary-500/10 transition-colors"></div>
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 font-heading group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-night-400 text-sm leading-relaxed font-body">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-night-600 group-hover:text-gold-500 transition-colors uppercase tracking-[0.2em]">Ordre {category.order}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-4 text-night-300 font-medium text-xs">
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faBookOpen} className="text-[10px] text-primary-500" />
                      {category._count.lessons} leçon{category._count.lessons > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(category)}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-gold-500 text-night-400 hover:text-white rounded-xl transition-all shadow-lg"
                      title="Modifier la thématique"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, categoryId: category.id })}
                      className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500 text-night-400 hover:text-white rounded-xl transition-all shadow-lg"
                      title="Supprimer la thématique"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
        onConfirm={() => {
          if (deleteModal.categoryId) {
            handleDelete(deleteModal.categoryId)
          }
        }}
        title="Supprimer cette catégorie ?"
        message="Les leçons de cette catégorie ne seront pas supprimées, mais n'auront plus de catégorie assignée."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        confirmColor="red"
      />
    </div>
  )
}
