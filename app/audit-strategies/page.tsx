'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import DataTable from '@/components/data-table'
import FormModal from '@/components/form-modal'
import {
  getAuditStrategies,
  createAuditStrategy,
  updateAuditStrategy,
  deleteAuditStrategy,
} from '@/app/actions/audit'
import { useSession } from '@/lib/auth-client'

interface AuditStrategy {
  id: string
  name: string
  description?: string
  status: string
  strategyType?: string
  fiscalYear?: string
  focusAreas?: string
  budget?: string
  resourcesRequired?: string
  expectedOutcomes?: string
}

export default function AuditStrategiesPage() {
  const [strategies, setStrategies] = useState<AuditStrategy[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState<AuditStrategy | null>(null)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchStrategies()
  }, [])

  async function fetchStrategies() {
    try {
      setLoading(true)
      const data = await getAuditStrategies()
      setStrategies(data || [])
    } catch (error) {
      console.error('Failed to fetch audit strategies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingStrategy(null)
    setIsModalOpen(true)
  }

  const handleEdit = (strategy: AuditStrategy) => {
    setEditingStrategy(strategy)
    setIsModalOpen(true)
  }

  const handleDelete = async (strategy: AuditStrategy) => {
    if (confirm(`Delete "${strategy.name}"?`)) {
      try {
        await deleteAuditStrategy(strategy.id)
        fetchStrategies()
      } catch (error) {
        console.error('Failed to delete strategy:', error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingStrategy) {
        await updateAuditStrategy(editingStrategy.id, data)
      } else {
        await createAuditStrategy(data)
      }
      fetchStrategies()
    } catch (error) {
      console.error('Failed to save strategy:', error)
    }
  }

  const columns = [
    { key: 'name', label: 'Strategy Name' },
    { key: 'status', label: 'Status' },
    { key: 'strategyType', label: 'Type' },
    { key: 'fiscalYear', label: 'Fiscal Year' },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Strategy Name',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'archived', label: 'Archived' },
        { value: 'in_progress', label: 'In Progress' },
      ],
    },
    { name: 'strategyType', label: 'Strategy Type', type: 'text' as const },
    { name: 'fiscalYear', label: 'Fiscal Year', type: 'text' as const },
    { name: 'focusAreas', label: 'Focus Areas', type: 'textarea' as const },
    { name: 'budget', label: 'Budget', type: 'text' as const },
    {
      name: 'resourcesRequired',
      label: 'Resources Required',
      type: 'textarea' as const,
    },
    {
      name: 'expectedOutcomes',
      label: 'Expected Outcomes',
      type: 'textarea' as const,
    },
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
            <h1 className="text-3xl font-bold text-slate-900">Audit Strategies</h1>
            <p className="text-slate-600 mt-2">
              Manage and plan audit strategies and initiatives
            </p>
          </div>

          <DataTable
            data={strategies}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            newButtonLabel="Add Strategy"
          />

          <FormModal
            isOpen={isModalOpen}
            title={
              editingStrategy
                ? 'Edit Audit Strategy'
                : 'Create New Audit Strategy'
            }
            fields={formFields}
            initialData={editingStrategy || undefined}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
