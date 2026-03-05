'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAward, faPlus, faTrashCan, faBookOpen, faXmark, faFloppyDisk, faCircleCheck, faPenNib, faListCheck, faCircleQuestion, faTrash, faSquareCheck, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { api, lessonsAPI } from '@/lib/api'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function AdminExercisesPage() {
  const router = useRouter()
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()
  const [exercises, setExercises] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Données du formulaire
  const [title, setTitle] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [exerciseType, setExerciseType] = useState('QCM') // QCM ou OPEN_QUESTION
  const [questions, setQuestions] = useState<any[]>([])

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; exerciseId: string | null }>({
    isOpen: false,
    exerciseId: null
  })
  const [editingId, setEditingId] = useState<string | null>(null)

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
      const [exercisesRes, lessonsRes] = await Promise.all([
        api.get('/exercises').catch(() => ({ data: [] })),
        lessonsAPI.getAll()
      ])

      setExercises(exercisesRes.data || [])
      setLessons(lessonsRes.data || [])
    } catch (error) {
      console.error('Erreur de chargement:', error)
      setExercises([])
      setLessons([])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setLessonId('')
    setExerciseType('QCM')
    setQuestions([])
  }

  const openForm = () => {
    resetForm()
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    resetForm()
    setEditingId(null)
  }

  // Ajouter une question QCM
  const addQCMQuestion = () => {
    setQuestions([...questions, {
      type: 'QCM',
      questionText: '',
      answers: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    }])
  }

  // Ajouter une question ouverte
  const addOpenQuestion = () => {
    setQuestions([...questions, {
      type: 'OPEN',
      questionText: '',
      correctAnswer: '' // Pour référence de l'admin
    }])
  }

  // Supprimer une question
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  // Modifier le texte d'une question
  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[index].questionText = text
    setQuestions(newQuestions)
  }

  // Ajouter une réponse à un QCM
  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers.push({ text: '', isCorrect: false })
    setQuestions(newQuestions)
  }

  // Supprimer une réponse
  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_: any, i: number) => i !== answerIndex)
    setQuestions(newQuestions)
  }

  // Modifier le texte d'une réponse
  const updateAnswerText = (questionIndex: number, answerIndex: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers[answerIndex].text = text
    setQuestions(newQuestions)
  }

  // Cocher/décocher une bonne réponse
  const toggleCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers[answerIndex].isCorrect = !newQuestions[questionIndex].answers[answerIndex].isCorrect
    setQuestions(newQuestions)
  }

  // Modifier la réponse attendue d'une question ouverte
  const updateCorrectAnswer = (index: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[index].correctAnswer = text
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validations
    if (!title.trim()) {
      toast.error('Le titre est requis')
      return
    }

    if (!lessonId) {
      toast.error('Sélectionnez une leçon')
      return
    }

    if (questions.length === 0) {
      toast.error('Ajoutez au moins une question')
      return
    }

    // Vérifier que chaque QCM a au moins une bonne réponse
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]

      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1} : Le texte de la question est requis`)
        return
      }

      if (q.type === 'QCM') {
        const hasCorrect = q.answers.some((a: any) => a.isCorrect)
        if (!hasCorrect) {
          toast.error(`Question ${i + 1} : Cochez au moins une bonne réponse`)
          return
        }

        const emptyAnswer = q.answers.find((a: any) => !a.text.trim())
        if (emptyAnswer) {
          toast.error(`Question ${i + 1} : Toutes les réponses doivent avoir un texte`)
          return
        }
      }
    }

    try {
      const data = {
        title,
        type: exerciseType,
        lessonId,
        questions: questions.map(q => ({
          text: q.questionText,
          type: q.type,
          answers: q.type === 'QCM' ? q.answers : undefined,
          correctAnswer: q.type === 'OPEN' ? q.correctAnswer : undefined
        }))
      }

      if (editingId) {
        await api.patch(`/exercises/${editingId}`, data)
        toast.success('✅ Exercice mis à jour !')
      } else {
        await api.post('/exercises', data)
        toast.success('✅ Exercice créé avec succès !')
      }

      closeForm()
      loadData()
    } catch (error: any) {
      console.error('Erreur de sauvegarde:', error)
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/exercises/${id}`)
      toast.success('Exercice supprimé')
      loadData()
    } catch (error) {
      console.error('Erreur de suppression:', error)
      toast.error('Impossible de supprimer l\'exercice')
    }
  }

  const handleEdit = (exercise: any) => {
    setEditingId(exercise.id)
    setTitle(exercise.title)
    setLessonId(exercise.lessonId)
    setExerciseType(exercise.type)
    setQuestions(exercise.questions.map((q: any) => ({
      type: q.answers && q.answers.length > 0 ? 'QCM' : 'OPEN',
      questionText: q.question,
      answers: q.answers,
      correctAnswer: q.correctAnswer
    })))
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!user || user.role !== 'ADMIN') return null

  const publishedLessons = lessons.filter(l => l.status === 'PUBLISHED')

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 font-heading">Gestion des Exercices</h1>
            <p className="text-night-300">Créez et modifiez les exercices pour vos apprenants</p>
          </div>
          {!showForm && (
            <button
              onClick={openForm}
              className="flex items-center gap-3 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary-500/20 group"
            >
              <FontAwesomeIcon icon={faPlus} className="group-hover:rotate-90 transition-transform" />
              Nouvel exercice
            </button>
          )}
        </div>

        {/* Formulaire de création/modification */}
        {showForm && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? '📝 Modifier l\'exercice' : '✨ Créer un exercice'}
              </h2>
              <button onClick={closeForm} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors">
                <FontAwesomeIcon icon={faXmark} className="text-xl text-night-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ÉTAPE 1 : Informations de base */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm">1</span>
                  Informations de base
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">
                        Titre de l'exercice <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
                        placeholder="Ex: Quiz sur les règles du Tajweed..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">
                        Type d'exercice <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={exerciseType}
                        onChange={(e) => setExerciseType(e.target.value)}
                        className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
                      >
                        <option value="QCM" className="bg-night-800">Quiz QCM (Auto-corrigé)</option>
                        <option value="OPEN_QUESTION" className="bg-night-800">Questions ouvertes (Pratique libre)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3">
                      Leçon associée <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={lessonId}
                      onChange={(e) => setLessonId(e.target.value)}
                      className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-body text-sm"
                      required
                    >
                      <option value="" className="bg-night-800">-- Sélectionnez une leçon --</option>
                      {publishedLessons.map(lesson => (
                        <option key={lesson.id} value={lesson.id} className="bg-night-800">
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ÉTAPE 2 : Ajouter des questions */}
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
                  <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                    <span className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center text-gold-400 text-sm">2</span>
                    Questions ({questions.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addQCMQuestion}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-primary-500/20"
                    >
                      <FontAwesomeIcon icon={faListCheck} />
                      Ajouter QCM
                    </button>
                    <button
                      type="button"
                      onClick={addOpenQuestion}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-gold-500/20"
                    >
                      <FontAwesomeIcon icon={faPenNib} />
                      Question ouverte
                    </button>
                  </div>
                </div>

                {questions.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                    <FontAwesomeIcon icon={faCircleQuestion} className="text-5xl text-night-700 mb-6 opacity-20" />
                    <p className="text-night-300 font-bold mb-2">Aucune question ajoutée</p>
                    <p className="text-night-500 text-xs text-center mx-auto">
                      Commencez par ajouter un QCM ou une question ouverte
                    </p>
                  </div>
                )}

                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="mb-8 p-8 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 opacity-50"></div>
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 bg-primary-500 text-white font-black rounded-xl shadow-lg shadow-primary-500/20">
                          {qIndex + 1}
                        </span>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${question.type === 'QCM'
                          ? 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                          : 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                          }`}>
                          <FontAwesomeIcon icon={question.type === 'QCM' ? faListCheck : faPenNib} className="mr-2" />
                          {question.type === 'QCM' ? 'QCM Interactif' : 'Question ouverte'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-lg group"
                        title="Supprimer cette question"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                    </div>

                    <div className="mb-8">
                      <label className="block text-white text-[10px] font-black uppercase tracking-widest mb-3 text-left">
                        Enoncé de la question
                      </label>
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-night-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-heading font-medium text-lg leading-tight transition-all"
                        placeholder="Ex: Quel est le sens littéral du Tajweed ?"
                        required
                      />
                    </div>

                    {question.type === 'QCM' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-white text-sm font-medium">
                            Réponses (cochez les bonnes réponses ✓)
                          </label>
                          <button
                            type="button"
                            onClick={() => addAnswer(qIndex)}
                            className="text-primary-400 hover:text-primary-300 text-sm"
                          >
                            + Ajouter une réponse
                          </button>
                        </div>

                        <div className="space-y-2">
                          {question.answers.map((answer: any, aIndex: number) => (
                            <div key={aIndex} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg text-left">
                              <button
                                type="button"
                                onClick={() => toggleCorrectAnswer(qIndex, aIndex)}
                                className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-all ${answer.isCorrect
                                  ? 'bg-green-600 border-green-600'
                                  : 'bg-transparent border-white/30'
                                  }`}
                              >
                                {answer.isCorrect && <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 text-white" />}
                              </button>

                              <input
                                type="text"
                                value={answer.text}
                                onChange={(e) => updateAnswerText(qIndex, aIndex, e.target.value)}
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder={`Réponse ${aIndex + 1}`}
                                required
                              />

                              {question.answers.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeAnswer(qIndex, aIndex)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.type === 'OPEN' && (
                      <div className="text-left">
                        <label className="block text-white text-sm font-medium mb-2">
                          Réponse attendue (pour votre référence)
                        </label>
                        <textarea
                          value={question.correctAnswer || ''}
                          onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-body"
                          placeholder="Écrivez la réponse attendue (l'apprenant ne la verra pas, c'est pour votre référence)"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Boutons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  className="flex items-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary-500/20"
                  disabled={questions.length === 0}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {editingId ? 'Enregistrer les modifications' : 'Publier l\'exercice'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des exercices */}
        {!showForm && (
          loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-night-300">Chargement...</p>
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 border-dashed backdrop-blur-sm">
              <FontAwesomeIcon icon={faAward} className="text-7xl text-night-700 mx-auto mb-8 opacity-20" />
              <p className="text-night-300 text-xl font-bold mb-4 font-heading">Aucun exercice n'a encore été créé</p>
              <button
                onClick={openForm}
                className="inline-flex items-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary-500/20"
              >
                <FontAwesomeIcon icon={faPlus} />
                Créer le premier exercice
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group shadow-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${exercise.type === 'QCM'
                          ? 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                          : 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                          }`}>
                          {exercise.type === 'QCM' ? 'Quiz QCM' : 'Q. Ouverte'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-heading group-hover:text-primary-400 transition-colors leading-tight">{exercise.title}</h3>
                      <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2 text-night-400 text-xs font-medium">
                          <FontAwesomeIcon icon={faBookOpen} className="text-[10px] text-primary-500" />
                          <span className="max-w-[150px] truncate">{exercise.lesson?.title || 'Leçon supprimée'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-night-400 text-xs font-medium">
                          <FontAwesomeIcon icon={faListCheck} className="text-[10px] text-gold-500" />
                          {exercise.questions?.length || 0} question{(exercise.questions?.length || 0) > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(exercise)}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-primary-500 text-night-400 hover:text-white rounded-xl transition-all shadow-lg"
                        title="Modifier l'exercice"
                      >
                        <FontAwesomeIcon icon={faPenNib} className="text-sm" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, exerciseId: exercise.id })}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500 text-night-400 hover:text-white rounded-xl transition-all shadow-lg"
                        title="Supprimer l'exercice"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <Footer />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, exerciseId: null })}
        onConfirm={() => {
          if (deleteModal.exerciseId) {
            handleDelete(deleteModal.exerciseId)
            setDeleteModal({ isOpen: false, exerciseId: null })
          }
        }}
        title="Supprimer cet exercice ?"
        message="Cette action est irréversible. Tous les résultats des apprenants seront supprimés."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        confirmColor="red"
      />
    </div>
  )
}
