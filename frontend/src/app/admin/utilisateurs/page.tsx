'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers, faSearch, faUserShield, faEnvelope, faCalendarDay, faTrashCan, faChartBar, faMessage, faHeart
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { pluralize } from '@/utils/format'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: {
    lessonProgress: number
    comments: number
    favorites: number
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null
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
    loadUsers()
  }, [isAuthenticated, user])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, roleFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Impossible de charger les utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Filtre par rôle
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      )
    }

    setFilteredUsers(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`)
      toast.success('Utilisateur supprimé')
      loadUsers()
    } catch (error) {
      console.error('Erreur de suppression:', error)
      toast.error('Impossible de supprimer l\'utilisateur')
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
            Gestion des Utilisateurs
          </h1>
          <p className="text-night-300">
            {filteredUsers.length} {pluralize(filteredUsers.length, 'utilisateur')}
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recherche */}
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
              />
            </div>

            {/* Filtre rôle */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-gold-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
              >
                <option value="ALL" className="bg-night-800">Tous les rôles</option>
                <option value="ADMIN" className="bg-night-800">Administrateurs</option>
                <option value="LEARNER" className="bg-night-800">Apprenants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-night-300">Chargement...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
            <FontAwesomeIcon icon={faUsers} className="text-6xl text-night-700 mx-auto mb-6 opacity-20" />
            <p className="text-night-300 text-lg font-bold">Aucun utilisateur trouvé</p>
            <p className="text-night-500 text-sm mt-1">Réessayez avec d'autres critères de recherche</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-night-400 font-semibold">Utilisateur</th>
                    <th className="text-left px-6 py-4 text-night-400 font-semibold">Rôle</th>
                    <th className="text-left px-6 py-4 text-night-400 font-semibold">Inscription</th>
                    <th className="text-right px-6 py-4 text-night-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-white/5 hover:bg-white/10 transition-colors group"
                    >
                      {/* Utilisateur */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30 font-bold text-primary-400 font-heading">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-bold font-heading group-hover:text-primary-400 transition-colors">{u.name}</p>
                            <p className="text-night-400 text-xs flex items-center gap-2 mt-0.5">
                              <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rôle */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${u.role === 'ADMIN'
                          ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                          : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                          }`}>
                          {u.role === 'ADMIN' ? '👑 Admin' : '📚 Apprenant'}
                        </span>
                      </td>

                      {/* Inscription */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-night-300 text-xs font-medium">
                          <FontAwesomeIcon icon={faCalendarDay} className="text-night-500" />
                          {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </td>


                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 text-right">
                          {u.id !== user.id ? (
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, userId: u.id })}
                              className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-500/5 group"
                              title="Supprimer l'utilisateur"
                            >
                              <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">C'est vous</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistiques récapitulatives */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl group hover:bg-white/10 transition-colors">
            <p className="text-night-400 text-[10px] font-black uppercase tracking-widest mb-2">Communauté</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-white font-heading">{users.length}</p>
              <FontAwesomeIcon icon={faUsers} className="text-xl text-primary-500/50 group-hover:text-primary-500 transition-colors" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl group hover:bg-white/10 transition-colors">
            <p className="text-night-400 text-[10px] font-black uppercase tracking-widest mb-2">Administrateurs</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-gold-400 font-heading">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
              <FontAwesomeIcon icon={faUserShield} className="text-xl text-gold-500/50 group-hover:text-gold-500 transition-colors" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl group hover:bg-white/10 transition-colors">
            <p className="text-night-400 text-[10px] font-black uppercase tracking-widest mb-2">Apprenants</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-primary-400 font-heading">
                {users.filter(u => u.role === 'LEARNER').length}
              </p>
              <FontAwesomeIcon icon={faChartBar} className="text-xl text-primary-500/50 group-hover:text-primary-500 transition-colors" />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl group hover:bg-white/10 transition-colors">
            <p className="text-night-400 text-[10px] font-black uppercase tracking-widest mb-2">Apprenants Actifs</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-green-400 font-heading">
                {users.filter(u => u._count?.lessonProgress > 0).length}
              </p>
              <FontAwesomeIcon icon={faChartBar} className="text-xl text-green-500/50 group-hover:text-green-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null })}
        onConfirm={() => {
          if (deleteModal.userId) {
            handleDelete(deleteModal.userId)
          }
        }}
        title="Supprimer cet utilisateur ?"
        message="Cette action est irréversible. Toutes les données de l'utilisateur (progression, commentaires, favoris) seront supprimées."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        confirmColor="red"
      />
    </div>
  )
}
