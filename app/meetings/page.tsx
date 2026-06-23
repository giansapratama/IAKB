'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '@/components/app-sidebar'
import DataTable from '@/components/data-table'
import FormModal from '@/components/form-modal'
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from '@/app/actions/audit'
import { useSession } from '@/lib/auth-client'

interface Meeting {
  id: string
  title: string
  description?: string
  status: string
  meetingDate: string
  meetingType?: string
  location?: string
  attendees?: string
  agenda?: string
  notes?: string
  outcome?: string
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const { data: session } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchMeetings()
  }, [])

  async function fetchMeetings() {
    try {
      setLoading(true)
      const data = await getMeetings()
      setMeetings(data || [])
    } catch (error) {
      console.error('Failed to fetch meetings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingMeeting(null)
    setIsModalOpen(true)
  }

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setIsModalOpen(true)
  }

  const handleDelete = async (meeting: Meeting) => {
    if (confirm(`Delete "${meeting.title}"?`)) {
      try {
        await deleteMeeting(meeting.id)
        fetchMeetings()
      } catch (error) {
        console.error('Failed to delete meeting:', error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (editingMeeting) {
        await updateMeeting(editingMeeting.id, data)
      } else {
        await createMeeting(data)
      }
      fetchMeetings()
    } catch (error) {
      console.error('Failed to save meeting:', error)
    }
  }

  const columns = [
    { key: 'title', label: 'Meeting Title' },
    { key: 'status', label: 'Status' },
    { key: 'meetingDate', label: 'Date' },
    { key: 'meetingType', label: 'Type' },
    { key: 'location', label: 'Location' },
  ]

  const formFields = [
    {
      name: 'title',
      label: 'Meeting Title',
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
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      name: 'meetingDate',
      label: 'Meeting Date & Time',
      type: 'datetime-local' as const,
      required: true,
    },
    { name: 'meetingType', label: 'Meeting Type', type: 'text' as const },
    { name: 'location', label: 'Location', type: 'text' as const },
    { name: 'attendees', label: 'Attendees', type: 'textarea' as const },
    { name: 'agenda', label: 'Agenda', type: 'textarea' as const },
    { name: 'notes', label: 'Notes', type: 'textarea' as const },
    { name: 'outcome', label: 'Outcome', type: 'textarea' as const },
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
            <h1 className="text-3xl font-bold text-slate-900">Meetings</h1>
            <p className="text-slate-600 mt-2">
              Schedule and manage audit meetings and discussions
            </p>
          </div>

          <DataTable
            data={meetings}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNew={handleNew}
            newButtonLabel="Schedule Meeting"
          />

          <FormModal
            isOpen={isModalOpen}
            title={
              editingMeeting
                ? 'Edit Meeting'
                : 'Schedule New Meeting'
            }
            fields={formFields}
            initialData={editingMeeting || undefined}
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
