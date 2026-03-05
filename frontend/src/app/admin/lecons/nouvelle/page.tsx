'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk, faArrowLeft, faUpload, faXmark, faImage, faMusic, faVideo, faCircleInfo, faLayerGroup, faChartLine, faFileLines
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { lessonsAPI, categoriesAPI } from '@/lib/api'
import { toast } from 'sonner'

export default function NewLessonPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    level: 'BEGINNER',
    status: 'DRAFT',
    categoryId: '',
    order: 0,
  })
  const [files, setFiles] = useState<{
    image: File | null
    audio: File | null
    video: File | null
  }>({
    image: null,
    audio: null,
    video: null
  })
  const [previews, setPreviews] = useState<{
    image: string | null
    audio: string | null
    video: string | null
  }>({
    image: null,
    audio: null,
    video: null
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
      const response = await categoriesAPI.getAll()
      setCategories(response.data)
    } catch (error) {
      console.error('Erreur de chargement des catégories:', error)
    }
  }

  const handleFileChange = (type: 'image' | 'audio' | 'video', file: File | null) => {
    if (!file) {
      setFiles({ ...files, [type]: null })
      setPreviews({ ...previews, [type]: null })
      return
    }

    // Validation de taille (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 50MB)')
      return
    }

    // Validation de type
    const validTypes: { [key: string]: string[] } = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
      video: ['video/mp4', 'video/webm', 'video/ogg']
    }

    if (!validTypes[type].includes(file.type)) {
      toast.error(`Format ${type} non supporté`)
      return
    }

    setFiles({ ...files, [type]: file })

    // Créer un aperçu
    if (type === 'image') {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews({ ...previews, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    } else {
      setPreviews({ ...previews, [type]: file.name })
    }
  }

  const removeFile = (type: 'image' | 'audio' | 'video') => {
    setFiles({ ...files, [type]: null })
    setPreviews({ ...previews, [type]: null })
  }

  const uploadFiles = async () => {
    const uploadedUrls: any = {}

    try {
      setUploading(true)

      // Upload image
      if (files.image) {
        try {
          const imageRes = await lessonsAPI.uploadImage(files.image)
          uploadedUrls.imageUrl = imageRes.data.url
          toast.success('Image uploadée ✓')
        } catch (error) {
          console.error('Erreur upload image:', error)
          toast.error('Erreur lors de l\'upload de l\'image')
        }
      }

      // Upload audio
      if (files.audio) {
        try {
          const audioRes = await lessonsAPI.uploadAudio(files.audio)
          uploadedUrls.audioUrl = audioRes.data.url
          toast.success('Audio uploadé ✓')
        } catch (error) {
          console.error('Erreur upload audio:', error)
          toast.error('Erreur lors de l\'upload de l\'audio')
        }
      }

      // Upload vidéo
      if (files.video) {
        try {
          const videoRes = await lessonsAPI.uploadVideo(files.video)
          uploadedUrls.videoUrl = videoRes.data.url
          toast.success('Vidéo uploadée ✓')
        } catch (error) {
          console.error('Erreur upload vidéo:', error)
          toast.error('Erreur lors de l\'upload de la vidéo')
        }
      }

      return uploadedUrls
    } catch (error) {
      console.error('Erreur upload:', error)
      throw new Error('Erreur lors de l\'upload des fichiers')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Le titre est requis')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Le contenu est requis')
      return
    }

    try {
      setLoading(true)

      // Upload des fichiers d'abord
      const uploadedUrls = await uploadFiles()

      const data = {
        ...formData,
        ...uploadedUrls,
        categoryId: formData.categoryId || undefined
      }

      await lessonsAPI.create(data)
      toast.success('Leçon créée avec succès !')
      router.push('/admin/lecons')
    } catch (error: any) {
      console.error('Erreur de création:', error)
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-6 transition-all font-black uppercase tracking-widest text-[10px] bg-white/5 px-4 py-2 rounded-lg border border-white/10 group"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
            Retour à la liste
          </button>
          <h1 className="text-4xl font-bold text-white mb-2 font-heading">Créer une Nouvelle Leçon</h1>
          <p className="text-night-400 font-body">Configurez votre contenu pédagogique et vos supports multimédias</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Informations de base */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-30"></div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
              <FontAwesomeIcon icon={faCircleInfo} className="text-primary-500" />
              Informations de base
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">
                  Titre de la leçon <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-heading font-medium text-lg"
                  placeholder="Ex: Les bases du Tajweed - Introduction..."
                  required
                />
              </div>

              <div>
                <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">Description courte</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all font-body"
                  placeholder="Décrivez brièvement le contenu de cette leçon pour les apprenants..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">
                    <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-primary-500" />
                    Catégorie
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  >
                    <option value="" className="bg-night-800">Aucune catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-night-800">{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">
                    <FontAwesomeIcon icon={faChartLine} className="mr-2 text-gold-500" />
                    Niveau de difficulté
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  >
                    <option value="BEGINNER" className="bg-night-800">🟢 Débutant</option>
                    <option value="INTERMEDIATE" className="bg-night-800">🟡 Intermédiaire</option>
                    <option value="ADVANCED" className="bg-night-800">🔴 Avancé</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">Statut de publication</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  >
                    <option value="DRAFT" className="bg-night-800">📝 Brouillon</option>
                    <option value="PUBLISHED" className="bg-night-800">🚀 Publié</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold-500 opacity-30"></div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
              <FontAwesomeIcon icon={faFileLines} className="text-gold-500" />
              Contenu de la leçon
            </h2>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm leading-relaxed"
              placeholder="Rédigez ici le contenu de la leçon. Vous pouvez utiliser du texte riche..."
              required
            />
          </div>

          {/* Médias avec Upload */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-xl">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
              <FontAwesomeIcon icon={faUpload} className="text-primary-500" />
              Médias & Suppléments
            </h2>

            <div className="space-y-6">
              {/* Image */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faImage} className="text-primary-400" />
                  Image de couverture (JPG, PNG - Max 50MB)
                </label>
                {previews.image ? (
                  <div className="relative group/img overflow-hidden rounded-xl h-64 shadow-2xl">
                    <img src={previews.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile('image')}
                        className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-xl transform scale-75 group-hover/img:scale-100 transition-all"
                      >
                        <FontAwesomeIcon icon={faXmark} className="text-xl" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="block w-full px-4 py-12 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl text-center cursor-pointer hover:bg-white/10 hover:border-primary-500/50 transition-all group">
                    <FontAwesomeIcon icon={faUpload} className="text-4xl text-night-600 mx-auto mb-4 group-hover:text-primary-500 transition-colors" />
                    <p className="text-white font-bold mb-1">Télécharger une image</p>
                    <p className="text-night-500 text-xs">Glissez-déposez ou cliquez pour parcourir</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('image', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Audio */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMusic} className="text-primary-400" />
                  Fichier Audio (MP3, WAV - Max 50MB)
                </label>
                {previews.audio ? (
                  <div className="flex items-center gap-4 p-5 bg-white/10 rounded-xl border border-white/10 group">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30">
                      <FontAwesomeIcon icon={faMusic} className="text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{previews.audio}</p>
                      <p className="text-night-500 text-[10px] font-black uppercase tracking-widest">Fichier prêt pour l'envoi</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('audio')}
                      className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ) : (
                  <label className="block w-full px-4 py-8 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl text-center cursor-pointer hover:bg-white/10 hover:border-primary-500/50 transition-all group">
                    <FontAwesomeIcon icon={faUpload} className="text-3xl text-night-600 mx-auto mb-3 group-hover:text-primary-500 transition-colors" />
                    <p className="text-white text-sm font-bold">Ajouter un audio</p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange('audio', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Vidéo */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faVideo} className="text-gold-400" />
                  Support Vidéo (MP4 - Max 50MB)
                </label>
                {previews.video ? (
                  <div className="flex items-center gap-4 p-5 bg-white/10 rounded-xl border border-white/10 group">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
                      <FontAwesomeIcon icon={faVideo} className="text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{previews.video}</p>
                      <p className="text-night-500 text-[10px] font-black uppercase tracking-widest">Fichier prêt pour l'envoi</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('video')}
                      className="w-10 h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ) : (
                  <label className="block w-full px-4 py-8 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl text-center cursor-pointer hover:bg-white/10 hover:border-gold-500/50 transition-all group">
                    <FontAwesomeIcon icon={faUpload} className="text-3xl text-night-600 mx-auto mb-3 group-hover:text-gold-500 transition-colors" />
                    <p className="text-white text-sm font-bold">Ajouter une vidéo</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange('video', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Boutons Actions */}
          <div className="flex flex-wrap items-center gap-6 pt-12">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center gap-3 px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-primary-500/40 disabled:opacity-50 disabled:grayscale group"
            >
              <FontAwesomeIcon icon={faFloppyDisk} className="group-hover:scale-110 transition-transform" />
              {uploading ? "Upload en cours..." : loading ? "Traitement..." : "Créer et Publier la leçon"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/10 transition-all"
            >
              Annuler les changements
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
