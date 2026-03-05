'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAward,
  faCircleCheck,
  faCircleXmark,
  faArrowLeft,
  faArrowRight,
  faLock,
  faRotateRight,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/store/auth'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { pluralize, formatCount } from '@/utils/format'

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const exerciseId = params.id as string
  const { user, isAuthenticated, loadFromStorage } = useAuthStore()

  const [exercise, setExercise] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<any>({})
  const [questionResults, setQuestionResults] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)
  const [globalScore, setGlobalScore] = useState<number | null>(null)
  const [reviewMode, setReviewMode] = useState(false)

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour faire cet exercice')
      router.push('/connexion')
      return
    }
    loadExercise()
  }, [isAuthenticated, exerciseId])

  const loadExercise = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)

      // Charger les réponses précédentes si elles existent
      try {
        const resultsRes = await api.get(`/exercises/${exerciseId}/my-answers`)
        if (resultsRes.data && resultsRes.data.answers) {
          setUserAnswers(resultsRes.data.answers)
          setQuestionResults(resultsRes.data.questionResults || {})
          setGlobalScore(resultsRes.data.score)
        }
      } catch (err) {
        // Pas de résultats précédents
      }
    } catch (error) {
      console.error('Erreur de chargement:', error)
      toast.error('Exercice introuvable')
      router.push('/lecons')
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = exercise?.questions[currentQuestionIndex]
  const isQuestionAnswered = currentQuestion && userAnswers[currentQuestion.id] !== undefined
  const totalQuestions = exercise?.questions.length || 0
  const answeredCount = Object.keys(userAnswers).length
  const isExerciseComplete = answeredCount === totalQuestions

  const handleAnswerChange = (answerId: string) => {
    if (isQuestionAnswered) return // Déjà répondu, verrouillé

    const currentAnswers = userAnswers[currentQuestion.id] || []

    if (Array.isArray(currentAnswers)) {
      // Gestion des choix multiples
      if (currentAnswers.includes(answerId)) {
        setUserAnswers({
          ...userAnswers,
          [currentQuestion.id]: currentAnswers.filter(id => id !== answerId)
        })
      } else {
        setUserAnswers({
          ...userAnswers,
          [currentQuestion.id]: [...currentAnswers, answerId]
        })
      }
    } else {
      // Choix unique
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.id]: [answerId]
      })
    }
  }

  const handleOpenAnswerChange = (text: string) => {
    if (isQuestionAnswered) return

    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: text
    })
  }

  const handleSubmitAnswer = async () => {
    const answer = userAnswers[currentQuestion.id]

    if (!answer || (Array.isArray(answer) && answer.length === 0) || (typeof answer === 'string' && !answer.trim())) {
      toast.error('Veuillez répondre à la question')
      return
    }

    try {
      setSubmitting(true)

      // Envoyer la réponse au backend
      const response = await api.post(`/exercises/${exerciseId}/answer`, {
        questionId: currentQuestion.id,
        answer: answer
      })

      // Sauvegarder le résultat
      setQuestionResults({
        ...questionResults,
        [currentQuestion.id]: response.data
      })

      // Recalculer le score global
      if (response.data.globalScore !== undefined) {
        setGlobalScore(response.data.globalScore)
      }

      if (response.data.isCorrect) {
        toast.success('✅ Bonne réponse !')
      } else {
        toast.error('❌ Réponse incorrecte')
      }

      // Passer à la question suivante après 1 seconde
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
      }, 1000)

    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(error.response?.data?.message || 'Erreur lors de la soumission')
    } finally {
      setSubmitting(false)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    if (isExerciseComplete) setReviewMode(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-night-300 font-bold uppercase tracking-widest text-xs">Chargement de l'exercice...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!exercise) return null

  const result = questionResults[currentQuestion?.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-primary-950 to-night-900">
      <Header />

      <div className="container-custom py-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-8 font-black uppercase tracking-widest text-xs transition-all group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
          Retour aux leçons
        </button>

        {/* En-tête avec progression */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 leading-tight">{exercise.title}</h1>
              <p className="text-night-300 font-medium">
                {isExerciseComplete ? (
                  <span className="flex items-center gap-2 text-green-400">
                    <FontAwesomeIcon icon={faAward} />
                    Exercice terminé avec succès
                  </span>
                ) : (
                  `${pluralize(currentQuestionIndex + 1, 'Question')} sur ${totalQuestions}`
                )}
              </p>
            </div>
            {(globalScore !== null || isExerciseComplete) && (
              <div className="bg-white/5 rounded-2xl px-8 py-6 border border-white/10 text-center md:text-right shadow-inner">
                <p className="text-night-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                  {isExerciseComplete ? 'Score Final' : 'Score Actuel'}
                </p>
                <div className="text-5xl font-black text-primary-400 tabular-nums">
                  {globalScore ?? 0}<span className="text-xl ml-1">%</span>
                </div>
              </div>
            )}
          </div>

          {/* Barre de progression */}
          <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-night-400 text-[10px] font-black uppercase tracking-widest">
            <span>{formatCount(answeredCount, 'question')} répondue{pluralize(answeredCount, '', 's')}</span>
            <span>{totalQuestions} au total</span>
          </div>
        </div>

        {/* Navigation par bulles */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {exercise.questions.map((q: any, idx: number) => {
            const isAnswered = userAnswers[q.id] !== undefined
            const isCurrent = idx === currentQuestionIndex
            const qResult = questionResults[q.id]

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`w-10 h-10 rounded-xl font-black transition-all border-2 ${isCurrent
                  ? 'bg-primary-500 border-primary-400 text-white scale-110 shadow-lg shadow-primary-500/20'
                  : isAnswered
                    ? qResult?.isCorrect
                      ? 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'
                      : 'bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30'
                    : 'bg-white/5 border-white/10 text-night-500 hover:bg-white/10 hover:border-white/20'
                  }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        {/* Screen: Completed Summary or Current Question */}
        {isExerciseComplete && !reviewMode ? (
          <div className="bg-gradient-to-br from-primary-950/40 via-night-900/60 to-primary-950/40 border border-green-500/30 rounded-3xl p-12 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-green-500/20 shadow-lg shadow-green-500/10 animate-pulse">
                <FontAwesomeIcon icon={faAward} className="text-5xl text-green-400" />
              </div>

              <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Félicitations !</h2>
              <p className="text-night-300 mb-10 text-lg max-w-lg mx-auto leading-relaxed">
                Vous avez terminé cet exercice. Vos résultats ont été enregistrés et contribuent à votre progression gloable.
              </p>

              <div className="bg-white/5 rounded-3xl p-10 border border-white/10 mb-12 inline-block shadow-inner">
                <p className="text-night-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Score de réussite</p>
                <div className="text-8xl font-black text-primary-400 tabular-nums drop-shadow-lg">
                  {globalScore ?? 0}<span className="text-3xl ml-2 font-black opacity-50">%</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={() => router.push('/lecons')}
                  className="px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 group"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
                  Continuer l'apprentissage
                </button>
                <button
                  onClick={() => {
                    setReviewMode(true)
                    setCurrentQuestionIndex(0)
                  }}
                  className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3"
                >
                  <FontAwesomeIcon icon={faEye} />
                  Revoir mes réponses
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Question Block */
          <div className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-10 mb-10 transition-all duration-700 shadow-2xl relative overflow-hidden ${result
            ? result.isCorrect
              ? 'border-green-500/30'
              : 'border-red-500/30'
            : 'border-white/10'
            }`}>
            {/* Header of question block */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/20">
                  {currentQuestionIndex + 1}
                </span>
                {isQuestionAnswered && (
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-night-400 flex items-center gap-3">
                    <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Question verrouillée</span>
                  </div>
                )}
              </div>
              {isExerciseComplete && (
                <button
                  onClick={() => setReviewMode(false)}
                  className="text-primary-400 hover:text-primary-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faAward} />
                  Voir mon score final
                </button>
              )}
            </div>

            <h2 className="text-3xl font-black text-white mb-10 leading-tight">
              {currentQuestion.question}
            </h2>

            {/* QCM Options */}
            {exercise.type === 'QCM' && (
              <div className="space-y-4 mb-10">
                {currentQuestion.answers.map((answer: any) => {
                  const userAnswerArray = userAnswers[currentQuestion.id] || []
                  const isSelected = Array.isArray(userAnswerArray)
                    ? userAnswerArray.includes(answer.id)
                    : userAnswerArray === answer.id
                  const showResult = isQuestionAnswered
                  const isCorrectAnswer = answer.isCorrect

                  return (
                    <label
                      key={answer.id}
                      className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 group ${showResult && isCorrectAnswer
                        ? 'bg-green-500/10 border-green-500/50 cursor-default'
                        : showResult && isSelected && !isCorrectAnswer
                          ? 'bg-red-500/10 border-red-500/50 cursor-default'
                          : isSelected
                            ? 'bg-primary-500/10 border-primary-500'
                            : 'bg-white/5 border-white/10'
                        } ${!isQuestionAnswered ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' : 'cursor-not-allowed'}`}
                    >
                      <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-white/20'}`}>
                        {isSelected && <FontAwesomeIcon icon={faCircleCheck} className="text-white text-sm" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAnswerChange(answer.id)}
                        disabled={isQuestionAnswered}
                        className="hidden"
                      />
                      <span className="flex-1 text-white font-medium text-lg">{answer.text}</span>
                      {showResult && isCorrectAnswer && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          <FontAwesomeIcon icon={faCircleCheck} />
                          Bonne Réponse
                        </div>
                      )}
                      {showResult && isSelected && !isCorrectAnswer && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          <FontAwesomeIcon icon={faCircleXmark} />
                          Votre choix
                        </div>
                      )}
                    </label>
                  )
                })}
              </div>
            )}

            {/* Open Question Textarea */}
            {exercise.type === 'OPEN_QUESTION' && (
              <div className="mb-10">
                <textarea
                  value={userAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleOpenAnswerChange(e.target.value)}
                  disabled={isQuestionAnswered}
                  rows={8}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder-night-600 focus:outline-none focus:ring-4 focus:ring-primary-500/20 resize-none disabled:opacity-50 font-body text-lg transition-all"
                  placeholder="Écrivez votre réponse ici de manière détaillée..."
                />
              </div>
            )}

            {/* Individual Question Feedback */}
            {result && (
              <div className={`p-8 rounded-3xl mb-10 border transition-all duration-500 animate-in slide-in-from-bottom-4 ${result.isCorrect
                ? 'bg-green-500/5 border-green-500/20 text-green-300'
                : 'bg-red-500/5 border-red-500/20 text-red-300'
                }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${result.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    <FontAwesomeIcon icon={result.isCorrect ? faCircleCheck : faCircleXmark} />
                  </div>
                  <span className="font-black uppercase tracking-widest text-sm">
                    {result.isCorrect ? 'C\'est parfait !' : 'Continuez d\'apprendre !'}
                  </span>
                </div>
                {result.feedback && (
                  <p className="text-base opacity-90 leading-relaxed pl-14">{result.feedback}</p>
                )}
              </div>
            )}

            {/* Navigation Buttons for Question Block */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/10"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Précédent
              </button>

              {!isQuestionAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={submitting}
                  className="w-full sm:flex-1 max-w-[300px] flex items-center justify-center gap-4 px-10 py-5 bg-primary-600 hover:bg-primary-700 disabled:bg-night-800 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-2xl shadow-primary-500/30 active:scale-95"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Valider ma réponse
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (currentQuestionIndex < totalQuestions - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                    } else if (isExerciseComplete) {
                      setReviewMode(false)
                    }
                  }}
                  className={`w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-4 ${currentQuestionIndex === totalQuestions - 1 ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-primary-600'} hover:brightness-110 disabled:opacity-30 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl`}
                >
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    isExerciseComplete ? 'Terminer la revue' : 'Calcul du score...'
                  ) : 'Question Suivante'}
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
