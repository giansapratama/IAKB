'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { exportToExcel } from '@/app/actions/excel'
import * as XLSX from 'xlsx'

export default function ExcelIntegration() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleExportClick = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const result = await exportToExcel()

      if (result.success) {
        // Create a new workbook
        const workbook = XLSX.utils.book_new()

        // Add each sheet
        Object.entries(result.data).forEach(([sheetName, data]) => {
          const worksheet = XLSX.utils.json_to_sheet(data as any[])
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
        })

        // Generate filename with timestamp
        const filename = `Audit-Knowledge-Base-${result.timestamp.split('T')[0]}.xlsx`

        // Write the file
        XLSX.writeFile(workbook, filename)

        setMessage({
          type: 'success',
          text: `Successfully exported ${Object.keys(result.data).length} sheets to Excel!`,
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to export data',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImportClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setMessage(null)

    try {
      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          const data = event.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })

          // Process each sheet
          let totalRecords = 0
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(worksheet)
            totalRecords += json.length
            console.log(`[v0] Sheet: ${sheetName}, Records: ${json.length}`)
          })

          setMessage({
            type: 'success',
            text: `Successfully read ${totalRecords} records from Excel. Import functionality coming soon!`,
          })
        } catch (error) {
          setMessage({
            type: 'error',
            text: 'Failed to parse Excel file',
          })
        } finally {
          setLoading(false)
        }
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to import data',
      })
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Export Data to Excel
          </label>
          <Button
            onClick={handleExportClick}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Exporting...' : '⬇️ Export to Excel'}
          </Button>
          <p className="text-xs text-slate-600 mt-2">
            Download all audit data in Excel format
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Import Data from Excel
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportClick}
              disabled={loading}
              className="hidden"
              id="excel-import"
            />
            <label htmlFor="excel-import">
              <div className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer text-center text-sm font-medium">
                {loading ? 'Importing...' : '⬆️ Import from Excel'}
              </div>
            </label>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Upload Excel file to import audit data
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-2">Excel Integration Info:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Export creates a multi-sheet Excel file with all audit data</li>
          <li>Each database (entities, regulations, applications, etc.) gets its own sheet</li>
          <li>Timestamps are included for tracking purposes</li>
          <li>Import functionality will validate data and update the database</li>
          <li>SharePoint sync coming soon for automatic uploads</li>
        </ul>
      </div>
    </div>
  )
}
