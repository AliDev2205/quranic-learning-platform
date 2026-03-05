'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/store/auth'
import { useEffect, useState } from 'react'
import ConfirmModal from '@/components/ui/ConfirmModal'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, loadFromStorage } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (mounted && !user && typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (userStr && token) {
        loadFromStorage()
      }
    }
  }, [mounted, user, loadFromStorage])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  if (!mounted) return null

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-gradient-to-r from-night-900 via-primary-950 to-night-900 border-b border-white/10">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 relative overflow-hidden rounded-lg transform group-hover:scale-110 transition-transform">
              <img
                src="/logo.jpg"
                alt="Arabe Pas A Pas"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
                Arabe Pas A Pas
              </h1>
              <p className="text-[10px] md:text-xs text-gold-300 hidden sm:block">
                Apprendre l'arabe facilement
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - TOUS SUR UNE LIGNE */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center">
            <Link
              href="/lecons"
              className={`px-2 xl:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${isActive('/lecons')
                  ? 'bg-primary-600 text-white'
                  : 'text-white hover:text-gold-300'
                }`}
            >
              Leçons
            </Link>
            <Link
              href="/exercices"
              className={`px-2 xl:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${isActive('/exercices')
                  ? 'bg-primary-600 text-white'
                  : 'text-white hover:text-gold-300'
                }`}
            >
              Exercices
            </Link>
            <Link
              href="/a-propos"
              className={`px-2 xl:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${isActive('/a-propos')
                  ? 'bg-primary-600 text-white'
                  : 'text-white hover:text-gold-300'
                }`}
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className={`px-2 xl:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${isActive('/contact')
                  ? 'bg-primary-600 text-white'
                  : 'text-white hover:text-gold-300'
                }`}
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons - TOUS SUR UNE LIGNE */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {isAuthenticated && user ? (
              <>
                {user.role === 'LEARNER' && (
                  <>
                    <Link
                      href="/progression"
                      className="px-2 xl:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all whitespace-nowrap text-xs xl:text-sm"
                    >
                      Ma Progression
                    </Link>
                    <Link
                      href="/mes-resultats"
                      className="px-2 xl:px-4 py-2 text-white hover:text-gold-300 transition-colors font-semibold whitespace-nowrap text-xs xl:text-sm"
                    >
                      Mes Résultats
                    </Link>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-2 xl:px-4 py-2 bg-gold-500 hover:bg-gold-600 text-night-900 font-semibold rounded-lg transition-all whitespace-nowrap text-xs xl:text-sm"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profil"
                  className="flex items-center gap-2 px-2 xl:px-4 py-2 text-white hover:text-gold-300 transition-colors whitespace-nowrap"
                  title={user.name}
                >
                  <FontAwesomeIcon icon={faUser} className="text-sm" />
                  <span className="hidden 2xl:inline text-xs xl:text-sm truncate max-w-[100px]">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2 px-2 xl:px-4 py-2 text-white hover:text-red-400 transition-colors whitespace-nowrap"
                  title="Déconnexion"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
                  <span className="hidden 2xl:inline text-xs xl:text-sm">
                    Déconnexion
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="px-3 xl:px-5 py-2 text-white hover:text-gold-300 transition-colors font-semibold whitespace-nowrap text-xs xl:text-sm"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="px-3 xl:px-5 py-2 bg-gold-500 hover:bg-gold-600 text-night-900 font-semibold rounded-lg transition-all shadow-lg hover:shadow-gold-500/50 whitespace-nowrap text-xs xl:text-sm"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3">
            <Link
              href="/lecons"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leçons
            </Link>
            <Link
              href="/exercices"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Exercices
            </Link>
            <Link
              href="/a-propos"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated && user ? (
              <>
                {user.role === 'LEARNER' && (
                  <>
                    <div className="border-t border-white/10 my-2"></div>
                    <Link
                      href="/progression"
                      className="block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ma Progression
                    </Link>
                    <Link
                      href="/mes-resultats"
                      className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mes Résultats
                    </Link>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <>
                    <div className="border-t border-white/10 my-2"></div>
                    <Link
                      href="/admin"
                      className="block px-4 py-2 bg-gold-500 hover:bg-gold-600 text-night-900 font-semibold rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </>
                )}
                <div className="border-t border-white/10 my-2"></div>
                <Link
                  href="/profil"
                  className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-sm w-5" />
                    <span>{user.name}</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setShowLogoutModal(true)
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-sm w-5" />
                    <span>Déconnexion</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-white/10 my-2"></div>
                <Link
                  href="/connexion"
                  className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="block px-4 py-2 bg-gold-500 hover:bg-gold-600 text-night-900 font-semibold rounded-lg transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Commencer
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Modal de déconnexion */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Déconnexion"
        cancelText="Annuler"
      />
    </header>
  )
}
