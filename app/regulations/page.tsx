'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import DataTable from '@/components/data-table'
import FormModal from '@/components/form-modal'
import {
  getRegulations,
  createRegulation,
  updateRegulation,
  deleteRegulation,
} from '@/app/actions/audit'
import { useSession } from '@/lib/auth-client'

interface Regulation {
  id: string
  name: string
  description?: string
  status: string
  regulationType?: string
  jurisdiction?: string
  effectiveDate?: string
  expiryDate?: string
  complianceStatus?: string
}

export default function RegulationsPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(null)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchRegulations()
  }, [])

  async function fetchRegulations() {
    try {
      setLoading(true)
      const data = await getRegulations()
      setRegulations(data || [])
    } catch (error) {
      console.error('Failed to fetch regulations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingRegulation(null)
    setIsModalOpen(true)
  }

  const handleEdit = (regulation: Regulation) => {
    setEditingRegulation(regulation)
    setIsModalOpen(true)
  }

  const handleDelete = async (regulation: Regulation) => {
    if (confirm(`Delete "${regulation.name}"?`)) {
      try {
        await deleteRegulation(regulation.id)
        fetchRegulations()
      } catch (error) {
        console.error('Failed to delete regulation:', error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingRegulation) {
        await updateRegulation(editingRegulation.id, data)
      } else {
        await createRegulation(data)
      }
      fetchRegulations()
    } catch (error) {
      console.error('Failed to save regulation:', error)
    }
  }

  const columns = [
    { key: 'name', label: 'Regulation Name' },
    { key: 'status', label: 'Status' },
    { key: 'regulationType', label: 'Type' },
    { key: 'jurisdiction', label: 'Jurisdiction' },
    { key: 'complianceStatus', label: 'Compliance' },
  ]

  const formFields = [
    { name: 'name', label: 'Regulation Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'archived', label: 'Archived' },
        { value: 'under_review', label: 'Under Review' },
      ],
    },
    { name: 'regulationType', label: 'Regulation Type', type: 'text' as const },
    { name: 'jurisdiction', label: 'Jurisdiction', type: 'text' as const },
    { name: 'effectiveDate', label: 'Effective Date', type: 'date' as const },
    { name: 'expiryDate', label: 'Expiry Date', type: 'date' as const },
    {
      name: 'complianceStatus',
      label: 'Compliance Status',
      type: 'select' as const,
      options: [
        { value: 'compliant', label: 'Compliant' },
        { value: 'non_compliant', label: 'Non-Compliant' },
        { value: 'partial_compliant', label: 'Partial Compliant' },
        { value: 'not_applicable', label: 'Not Applicable' },
      ],
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
            <h1 className="text-3xl font-bold text-slate-900">Regulations</h1>
            <p className="text-slate-600 mt-2">
              Manage and track all regulations and compliance requirements
            </p>
          </div>

          <DataTable
            data={regulations}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            newButtonLabel="Add Regulation"
          />

          <FormModal
            isOpen={isModalOpen}
            title={
              editingRegulation
                ? 'Edit Regulation'
                : 'Create New Regulation'
            }
            fields={formFields}
            initialData={editingRegulation || undefined}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
