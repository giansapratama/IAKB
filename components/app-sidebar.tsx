'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

interface User {
  id: string
  name?: string
  email: string
}

interface AppSidebarProps {
  user?: User
  isAdmin?: boolean
}

export default function AppSidebar({ user, isAdmin = false }: AppSidebarProps) {
  const pathname = usePathname()
  const [showLogout, setShowLogout] = useState(false)

  const isActive = (path: string) => pathname === path

  const menuItems = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Audit Entities', href: '/audit-entities', icon: '🎯' },
    { label: 'Functions', href: '/organization-functions', icon: '🏢' },
    { label: 'Regulations', href: '/regulations', icon: '⚖️' },
    { label: 'Applications', href: '/applications', icon: '💻' },
    { label: 'Strategies', href: '/audit-strategies', icon: '📋' },
    { label: 'Meetings', href: '/meetings', icon: '📅' },
  ]

  const adminMenuItems = [
    { label: 'User Management', href: '/admin/users', icon: '👥' },
    { label: 'System Settings', href: '/admin/settings', icon: '⚙️' },
  ]

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = '/sign-in'
  }

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col shadow-lg h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">Audit KB</h1>
        <p className="text-xs text-slate-400 mt-1">Knowledge Base</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold text-white truncate">{user?.name || user?.email}</p>
        <p className="text-xs text-slate-400 mt-1">
          {isAdmin ? '👮 Administrator' : '👤 User'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Admin
            </p>
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="relative">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ⚙️ Account
          </button>
          {showLogout && (
            <div className="absolute bottom-full left-0 right-0 bg-slate-800 rounded-lg shadow-lg p-2 mb-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
