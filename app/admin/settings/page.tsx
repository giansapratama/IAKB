'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import ExcelIntegration from '@/components/excel-integration'

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

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
            <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
            <p className="text-slate-600 mt-2">
              Configure system-wide settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                General Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter organization name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Audit Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Settings
                </Button>
              </div>
            </div>

            {/* Database Settings */}
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Database Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Database Status
                  </label>
                  <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    ✓ Connected - Neon PostgreSQL
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Auto Backup
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Backup Now
                </Button>
              </div>
            </div>

            {/* Excel Integration */}
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6 md:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Excel/SharePoint Integration
              </h2>
              <ExcelIntegration />
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  SharePoint Folder URL
                </label>
                <input
                  type="text"
                  placeholder="https://yourorganization.sharepoint.com/..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-600 mt-2">
                  Configure for automatic uploads to SharePoint (coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
