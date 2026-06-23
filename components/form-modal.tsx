'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface FormField {
  name: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'number'
  options?: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
}

interface FormModalProps {
  isOpen: boolean
  title: string
  fields: FormField[]
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<void>
  onClose: () => void
  loading?: boolean
}

export default function FormModal({
  isOpen,
  title,
  fields,
  initialData,
  onSubmit,
  onClose,
  loading = false,
}: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      const emptyData: Record<string, any> = {}
      fields.forEach((field) => {
        emptyData[field.name] = ''
      })
      setFormData(emptyData)
    }
  }, [initialData, fields, isOpen])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}
              >
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={submitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting || loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
