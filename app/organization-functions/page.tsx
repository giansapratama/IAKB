'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import DataTable from '@/components/data-table'
import FormModal from '@/components/form-modal'
import {
  getOrganizationFunctions,
  createOrganizationFunction,
  updateOrganizationFunction,
  deleteOrganizationFunction,
} from '@/app/actions/audit'
import { useSession } from '@/lib/auth-client'

interface OrgFunction {
  id: string
  name: string
  description?: string
  status: string
  owner?: string
  department?: string
  riskLevel?: string
}

export default function OrganizationFunctionsPage() {
  const [functions, setFunctions] = useState<OrgFunction[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFunction, setEditingFunction] = useState<OrgFunction | null>(null)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchFunctions()
  }, [])

  async function fetchFunctions() {
    try {
      setLoading(true)
      const data = await getOrganizationFunctions()
      setFunctions(data || [])
    } catch (error) {
      console.error('Failed to fetch organization functions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingFunction(null)
    setIsModalOpen(true)
  }

  const handleEdit = (func: OrgFunction) => {
    setEditingFunction(func)
    setIsModalOpen(true)
  }

  const handleDelete = async (func: OrgFunction) => {
    if (confirm(`Delete "${func.name}"?`)) {
      try {
        await deleteOrganizationFunction(func.id)
        fetchFunctions()
      } catch (error) {
        console.error('Failed to delete function:', error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingFunction) {
        await updateOrganizationFunction(editingFunction.id, data)
      } else {
        await createOrganizationFunction(data)
      }
      fetchFunctions()
    } catch (error) {
      console.error('Failed to save function:', error)
    }
  }

  const columns = [
    { key: 'name', label: 'Function Name' },
    { key: 'status', label: 'Status' },
    { key: 'department', label: 'Department' },
    { key: 'owner', label: 'Owner' },
    { key: 'riskLevel', label: 'Risk Level' },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Function Name',
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
        { value: 'review', label: 'Review' },
      ],
    },
    { name: 'department', label: 'Department', type: 'text' as const },
    { name: 'owner', label: 'Owner', type: 'text' as const },
    {
      name: 'riskLevel',
      label: 'Risk Level',
      type: 'select' as const,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
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
            <h1 className="text-3xl font-bold text-slate-900">
              Organization Functions
            </h1>
            <p className="text-slate-600 mt-2">
              Manage and track all organization functions
            </p>
          </div>

          <DataTable
            data={functions}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            newButtonLabel="Add Function"
          />

          <FormModal
            isOpen={isModalOpen}
            title={
              editingFunction
                ? 'Edit Organization Function'
                : 'Create New Organization Function'
            }
            fields={formFields}
            initialData={editingFunction || undefined}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
