'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import DataTable from '@/components/data-table'
import FormModal from '@/components/form-modal'
import {
  getAuditEntities,
  createAuditEntity,
  updateAuditEntity,
  deleteAuditEntity,
} from '@/app/actions/audit'
import { useSession } from '@/lib/auth-client'

interface AuditEntity {
  id: string
  name: string
  description?: string
  status: string
  entityType?: string
  location?: string
  riskRating?: string
  lastAuditDate?: string
  nextAuditDate?: string
  auditFrequency?: string
}

export default function AuditEntitiesPage() {
  const [entities, setEntities] = useState<AuditEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<AuditEntity | null>(null)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchEntities()
  }, [])

  async function fetchEntities() {
    try {
      setLoading(true)
      const data = await getAuditEntities()
      setEntities(data || [])
    } catch (error) {
      console.error('Failed to fetch audit entities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingEntity(null)
    setIsModalOpen(true)
  }

  const handleEdit = (entity: AuditEntity) => {
    setEditingEntity(entity)
    setIsModalOpen(true)
  }

  const handleDelete = async (entity: AuditEntity) => {
    if (confirm(`Delete "${entity.name}"?`)) {
      try {
        await deleteAuditEntity(entity.id)
        fetchEntities()
      } catch (error) {
        console.error('Failed to delete entity:', error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingEntity) {
        await updateAuditEntity(editingEntity.id, data)
      } else {
        await createAuditEntity(data)
      }
      fetchEntities()
    } catch (error) {
      console.error('Failed to save entity:', error)
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'entityType', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'riskRating', label: 'Risk Rating' },
    { key: 'auditFrequency', label: 'Audit Frequency' },
  ]

  const formFields = [
    { name: 'name', label: 'Entity Name', type: 'text' as const, required: true },
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
        { value: 'under_audit', label: 'Under Audit' },
        { value: 'pending_review', label: 'Pending Review' },
      ],
    },
    { name: 'entityType', label: 'Entity Type', type: 'text' as const },
    { name: 'location', label: 'Location', type: 'text' as const },
    {
      name: 'riskRating',
      label: 'Risk Rating',
      type: 'select' as const,
      options: [
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      name: 'lastAuditDate',
      label: 'Last Audit Date',
      type: 'date' as const,
    },
    {
      name: 'nextAuditDate',
      label: 'Next Audit Date',
      type: 'date' as const,
    },
    { name: 'auditFrequency', label: 'Audit Frequency', type: 'text' as const },
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
            <h1 className="text-3xl font-bold text-slate-900">Audit Entities</h1>
            <p className="text-slate-600 mt-2">
              Manage and track all audit entities
            </p>
          </div>

          <DataTable
            data={entities}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            newButtonLabel="Add Entity"
          />

          <FormModal
            isOpen={isModalOpen}
            title={editingEntity ? 'Edit Audit Entity' : 'Create New Audit Entity'}
            fields={formFields}
            initialData={editingEntity || undefined}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
