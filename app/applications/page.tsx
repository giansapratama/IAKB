'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import DataTable from '@/components/data-table'
import FormModal from '@/components/form-modal'
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/app/actions/audit'
import { useSession } from '@/lib/auth-client'

interface Application {
  id: string
  name: string
  description?: string
  status: string
  applicationOwner?: string
  riskClassification?: string
  lastAuditDate?: string
  nextScheduledAudit?: string
  platform?: string
  dataClassification?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    try {
      setLoading(true)
      const data = await getApplications()
      setApplications(data || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingApp(null)
    setIsModalOpen(true)
  }

  const handleEdit = (app: Application) => {
    setEditingApp(app)
    setIsModalOpen(true)
  }

  const handleDelete = async (app: Application) => {
    if (confirm(`Delete "${app.name}"?`)) {
      try {
        await deleteApplication(app.id)
        fetchApplications()
      } catch (error) {
        console.error('Failed to delete application:', error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, data)
      } else {
        await createApplication(data)
      }
      fetchApplications()
    } catch (error) {
      console.error('Failed to save application:', error)
    }
  }

  const columns = [
    { key: 'name', label: 'Application Name' },
    { key: 'status', label: 'Status' },
    { key: 'applicationOwner', label: 'Owner' },
    { key: 'riskClassification', label: 'Risk Level' },
    { key: 'platform', label: 'Platform' },
  ]

  const formFields = [
    { name: 'name', label: 'Application Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'retired', label: 'Retired' },
        { value: 'in_development', label: 'In Development' },
      ],
    },
    { name: 'applicationOwner', label: 'Application Owner', type: 'text' as const },
    {
      name: 'riskClassification',
      label: 'Risk Classification',
      type: 'select' as const,
      options: [
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    { name: 'lastAuditDate', label: 'Last Audit Date', type: 'date' as const },
    { name: 'nextScheduledAudit', label: 'Next Scheduled Audit', type: 'date' as const },
    { name: 'platform', label: 'Platform', type: 'text' as const },
    { name: 'dataClassification', label: 'Data Classification', type: 'text' as const },
  ]

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AppSidebar user={session?.user} isAdmin={isAdmin} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Applications/Systems
            </h1>
            <p className="text-slate-600 mt-2">
              Manage and track all applications and systems under audit
            </p>
          </div>

          <DataTable
            data={applications}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            newButtonLabel="Add Application"
          />

          <FormModal
            isOpen={isModalOpen}
            title={
              editingApp
                ? 'Edit Application'
                : 'Create New Application'
            }
            fields={formFields}
            initialData={editingApp || undefined}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
