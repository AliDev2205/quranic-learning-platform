'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faClock, faChartLine, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { lessonsAPI, categoriesAPI } from '@/lib/api'
import { toast } from 'sonner'

interface Lesson {
  id: string
  title: string
  slug: string
  description: string
  level: string
  imageUrl: string | null
  createdAt: string
  category: {
    id: string
    name: string
  } | null
}

interface Category {
  id: string
  name: string
  description: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedCategory, selectedLevel])

  const loadData = async () => {
    try {
      setLoading(true)
      const [lessonsRes, categoriesRes] = await Promise.all([
        lessonsAPI.getPublished(selectedCategory, selectedLevel),
        categoriesAPI.getAll()
      ])

      setLessons(lessonsRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Impossible de charger les leçons')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData()
      return
    }

    try {
      setLoading(true)
      const response = await lessonsAPI.search(searchQuery)
      setLessons(response.data)
    } catch (error) {
      console.error('Erreur de recherche:', error)
      toast.error('Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-primary-500/20 text-primary-300 border-primary-500/30'
      case 'INTERMEDIATE':
        return 'bg-gold-500/20 text-gold-300 border-gold-500/30'
      case 'ADVANCED':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-night-500/20 text-night-300 border-night-500/30'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'Débutant'
      case 'INTERMEDIATE':
        return 'Intermédiaire'
      case 'ADVANCED':
        return 'Avancé'
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-20">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 font-amiri">
            Parcourir les Leçons
          </h1>
          <p className="text-xl text-night-300 max-w-2xl mx-auto">
            Découvrez nos leçons structurées pour apprendre la lecture coranique étape par étape
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-12 space-y-4">
          {/* Recherche */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-night-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher une leçon..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
            >
              Rechercher
            </button>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-4">
            {/* Catégorie */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-white text-sm font-medium mb-2">
                <FontAwesomeIcon icon={faFilter} className="mr-2 text-gold-400" />
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-night-800">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Niveau */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-white text-sm font-medium mb-2">
                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-primary-400" />
                Niveau
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les niveaux</option>
                <option value="BEGINNER" className="bg-night-800">Débutant</option>
                <option value="INTERMEDIATE" className="bg-night-800">Intermédiaire</option>
                <option value="ADVANCED" className="bg-night-800">Avancé</option>
              </select>
            </div>

            {/* Bouton reset */}
            {(selectedCategory || selectedLevel || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedLevel('')
                  setSearchQuery('')
                  loadData()
                }}
                className="self-end px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Liste des leçons */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-night-300">Chargement des leçons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faBookOpen} className="text-5xl text-night-700 mx-auto mb-4 opacity-20" />
            <p className="text-night-300 text-lg">Aucune leçon trouvée</p>
            <p className="text-night-500 text-sm mt-2">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lecons/${lesson.slug}`}
                className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-gold-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 transform"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-primary-900 to-night-900 flex items-center justify-center">
                  {lesson.imageUrl ? (
                    <img
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-gold-400/50" />
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* Catégorie et niveau */}
                  <div className="flex items-center gap-2 mb-3">
                    {lesson.category && (
                      <span className="text-xs px-2 py-1 bg-gold-500/20 text-gold-300 rounded border border-gold-500/30">
                        {lesson.category.name}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded border ${getLevelBadgeColor(lesson.level)}`}>
                      {getLevelLabel(lesson.level)}
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
                    {lesson.title}
                  </h3>

                  {/* Description */}
                  <p className="text-night-300 text-sm line-clamp-2 mb-4">
                    {lesson.description || 'Découvrez cette leçon passionnante sur la lecture coranique.'}
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-night-400 text-xs">
                    <FontAwesomeIcon icon={faClock} className="text-primary-400" />
                    <span>
                      {new Date(lesson.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
