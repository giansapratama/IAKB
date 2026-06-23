'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Column {
  key: string
  label: string
  render?: (value: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onNew?: () => void
  title?: string
  newButtonLabel?: string
}

export default function DataTable({
  data,
  columns,
  onEdit,
  onDelete,
  onNew,
  title,
  newButtonLabel = 'Add New',
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filteredData = data.filter((item) =>
    columns.some((col) =>
      String(item[col.key] || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
  )

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDir === 'asc' ? comparison : -comparison
      })
    : filteredData

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      under_audit: 'bg-yellow-100 text-yellow-800',
      pending_review: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
      review: 'bg-orange-100 text-orange-800',
      archived: 'bg-gray-100 text-gray-800',
      under_review: 'bg-orange-100 text-orange-800',
      retired: 'bg-gray-100 text-gray-800',
      in_development: 'bg-blue-100 text-blue-800',
      compliant: 'bg-green-100 text-green-800',
      non_compliant: 'bg-red-100 text-red-800',
      partial_compliant: 'bg-yellow-100 text-yellow-800',
      not_applicable: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="w-full space-y-4">
      {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {onNew && (
          <Button
            onClick={onNew}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + {newButtonLabel}
          </Button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-6 py-3 text-left text-sm font-semibold text-slate-900 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortKey === col.key && (
                      <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-slate-900">
                      {col.render && item[col.key] ? (
                        col.render(item[col.key])
                      ) : col.key === 'status' ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            item[col.key],
                          )}`}
                        >
                          {item[col.key]}
                        </span>
                      ) : col.key.includes('Date') || col.key.includes('date') ? (
                        new Date(item[col.key]).toLocaleDateString()
                      ) : (
                        String(item[col.key] || '-')
                      )}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500">
        Showing {sortedData.length} of {data.length} records
      </p>
    </div>
  )
}
