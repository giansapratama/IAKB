import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import { useSession } from '@/lib/auth-client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { user, userRoles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

interface User {
  id: string
  email: string
  name?: string
  role: 'admin' | 'user'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [session])

  async function checkAdminStatus() {
    if (session?.user) {
      try {
        // This would require fetching user role from the database
        // For now, this is a placeholder
        setIsAdmin(true)
      } catch (error) {
        console.error('Failed to check admin status:', error)
      }
    }
  }

  if (!session?.user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-600">Please log in first</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen">
        <AppSidebar user={session?.user} isAdmin={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">Access Denied</p>
            <p className="text-slate-600 mt-2">
              You don&apos;t have admin permissions
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AppSidebar user={session?.user} isAdmin={true} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-600 mt-2">
              Manage user roles and permissions
            </p>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                User management is being implemented
              </p>
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Features Coming Soon</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>User list with email and role display</li>
              <li>Assign admin/user roles</li>
              <li>User activity logs</li>
              <li>Bulk role management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
