'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  organizationFunctions,
  auditEntities,
  regulations,
  applications,
  auditStrategies,
  meetings,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function exportToExcel() {
  const userId = await getUserId()

  try {
    // Fetch all data
    const [functions, entities, regs, apps, strategies, mts] = await Promise.all([
      db
        .select()
        .from(organizationFunctions)
        .where(eq(organizationFunctions.userId, userId)),
      db
        .select()
        .from(auditEntities)
        .where(eq(auditEntities.userId, userId)),
      db
        .select()
        .from(regulations)
        .where(eq(regulations.userId, userId)),
      db
        .select()
        .from(applications)
        .where(eq(applications.userId, userId)),
      db
        .select()
        .from(auditStrategies)
        .where(eq(auditStrategies.userId, userId)),
      db
        .select()
        .from(meetings)
        .where(eq(meetings.userId, userId)),
    ])

    // Prepare data in Excel format
    const sheetData = {
      'Organization Functions': functions.map((f) => ({
        'ID': f.id,
        'Name': f.name,
        'Description': f.description,
        'Status': f.status,
        'Owner': f.owner,
        'Department': f.department,
        'Risk Level': f.riskLevel,
        'Created': new Date(f.createdAt).toISOString(),
      })),
      'Audit Entities': entities.map((e) => ({
        'ID': e.id,
        'Name': e.name,
        'Description': e.description,
        'Status': e.status,
        'Type': e.entityType,
        'Location': e.location,
        'Risk Rating': e.riskRating,
        'Last Audit': e.lastAuditDate ? new Date(e.lastAuditDate).toISOString() : '',
        'Next Audit': e.nextAuditDate ? new Date(e.nextAuditDate).toISOString() : '',
        'Frequency': e.auditFrequency,
        'Created': new Date(e.createdAt).toISOString(),
      })),
      'Regulations': regs.map((r) => ({
        'ID': r.id,
        'Name': r.name,
        'Description': r.description,
        'Status': r.status,
        'Type': r.regulationType,
        'Jurisdiction': r.jurisdiction,
        'Effective Date': r.effectiveDate ? new Date(r.effectiveDate).toISOString() : '',
        'Expiry Date': r.expiryDate ? new Date(r.expiryDate).toISOString() : '',
        'Compliance Status': r.complianceStatus,
        'Created': new Date(r.createdAt).toISOString(),
      })),
      'Applications': apps.map((a) => ({
        'ID': a.id,
        'Name': a.name,
        'Description': a.description,
        'Status': a.status,
        'Owner': a.applicationOwner,
        'Risk Classification': a.riskClassification,
        'Last Audit': a.lastAuditDate ? new Date(a.lastAuditDate).toISOString() : '',
        'Next Audit': a.nextScheduledAudit ? new Date(a.nextScheduledAudit).toISOString() : '',
        'Platform': a.platform,
        'Data Classification': a.dataClassification,
        'Created': new Date(a.createdAt).toISOString(),
      })),
      'Audit Strategies': strategies.map((s) => ({
        'ID': s.id,
        'Name': s.name,
        'Description': s.description,
        'Status': s.status,
        'Type': s.strategyType,
        'Fiscal Year': s.fiscalYear,
        'Focus Areas': s.focusAreas,
        'Budget': s.budget,
        'Resources': s.resourcesRequired,
        'Expected Outcomes': s.expectedOutcomes,
        'Created': new Date(s.createdAt).toISOString(),
      })),
      'Meetings': mts.map((m) => ({
        'ID': m.id,
        'Title': m.title,
        'Description': m.description,
        'Status': m.status,
        'Meeting Date': new Date(m.meetingDate).toISOString(),
        'Type': m.meetingType,
        'Location': m.location,
        'Attendees': m.attendees,
        'Agenda': m.agenda,
        'Notes': m.notes,
        'Outcome': m.outcome,
        'Created': new Date(m.createdAt).toISOString(),
      })),
    }

    return {
      success: true,
      data: sheetData,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Export error:', error)
    throw new Error('Failed to export data')
  }
}

export async function importFromExcel(file: File) {
  const userId = await getUserId()

  try {
    // This is a placeholder for Excel import functionality
    // In a real implementation, you would:
    // 1. Parse the Excel file
    // 2. Validate the data
    // 3. Insert into the database
    
    return {
      success: true,
      message: 'Excel import functionality coming soon',
      recordsImported: 0,
    }
  } catch (error) {
    console.error('Import error:', error)
    throw new Error('Failed to import data')
  }
}
