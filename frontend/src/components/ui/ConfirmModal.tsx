'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'red' | 'primary'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmColor = 'primary'
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-night-800 to-night-900 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"
        >
          <FontAwesomeIcon icon={faXmark} className="text-lg" />
        </button>

        {/* Contenu */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">
            {title}
          </h3>
          <p className="text-night-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${confirmColor === 'red'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
