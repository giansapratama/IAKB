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
  userRoles,
} from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateRandomString } from 'better-auth/crypto'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

async function getUserRole(userId: string) {
  const role = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId))
  return role[0]?.role || 'user'
}

// Organization Functions
export async function getOrganizationFunctions() {
  const userId = await getUserId()
  return db
    .select()
    .from(organizationFunctions)
    .where(eq(organizationFunctions.userId, userId))
    .orderBy(desc(organizationFunctions.createdAt))
}

export async function createOrganizationFunction(data: {
  name: string
  description?: string
  owner?: string
  department?: string
  riskLevel?: string
}) {
  const userId = await getUserId()
  const id = generateRandomString()
  await db.insert(organizationFunctions).values({
    id,
    userId,
    ...data,
  })
  revalidatePath('/organization-functions')
  return { id }
}

export async function updateOrganizationFunction(
  id: string,
  data: Partial<typeof data>,
) {
  const userId = await getUserId()
  await db
    .update(organizationFunctions)
    .set(data)
    .where(
      and(
        eq(organizationFunctions.id, id),
        eq(organizationFunctions.userId, userId),
      ),
    )
  revalidatePath('/organization-functions')
}

export async function deleteOrganizationFunction(id: string) {
  const userId = await getUserId()
  await db
    .delete(organizationFunctions)
    .where(
      and(
        eq(organizationFunctions.id, id),
        eq(organizationFunctions.userId, userId),
      ),
    )
  revalidatePath('/organization-functions')
}

// Audit Entities
export async function getAuditEntities() {
  const userId = await getUserId()
  return db
    .select()
    .from(auditEntities)
    .where(eq(auditEntities.userId, userId))
    .orderBy(desc(auditEntities.createdAt))
}

export async function createAuditEntity(data: any) {
  const userId = await getUserId()
  const id = generateRandomString()
  await db.insert(auditEntities).values({
    id,
    userId,
    ...data,
  })
  revalidatePath('/audit-entities')
  return { id }
}

export async function updateAuditEntity(id: string, data: any) {
  const userId = await getUserId()
  await db
    .update(auditEntities)
    .set(data)
    .where(
      and(eq(auditEntities.id, id), eq(auditEntities.userId, userId)),
    )
  revalidatePath('/audit-entities')
}

export async function deleteAuditEntity(id: string) {
  const userId = await getUserId()
  await db
    .delete(auditEntities)
    .where(
      and(eq(auditEntities.id, id), eq(auditEntities.userId, userId)),
    )
  revalidatePath('/audit-entities')
}

// Regulations
export async function getRegulations() {
  const userId = await getUserId()
  return db
    .select()
    .from(regulations)
    .where(eq(regulations.userId, userId))
    .orderBy(desc(regulations.createdAt))
}

export async function createRegulation(data: any) {
  const userId = await getUserId()
  const id = generateRandomString()
  await db.insert(regulations).values({
    id,
    userId,
    ...data,
  })
  revalidatePath('/regulations')
  return { id }
}

export async function updateRegulation(id: string, data: any) {
  const userId = await getUserId()
  await db
    .update(regulations)
    .set(data)
    .where(and(eq(regulations.id, id), eq(regulations.userId, userId)))
  revalidatePath('/regulations')
}

export async function deleteRegulation(id: string) {
  const userId = await getUserId()
  await db
    .delete(regulations)
    .where(and(eq(regulations.id, id), eq(regulations.userId, userId)))
  revalidatePath('/regulations')
}

// Applications
export async function getApplications() {
  const userId = await getUserId()
  return db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.createdAt))
}

export async function createApplication(data: any) {
  const userId = await getUserId()
  const id = generateRandomString()
  await db.insert(applications).values({
    id,
    userId,
    ...data,
  })
  revalidatePath('/applications')
  return { id }
}

export async function updateApplication(id: string, data: any) {
  const userId = await getUserId()
  await db
    .update(applications)
    .set(data)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
  revalidatePath('/applications')
}

export async function deleteApplication(id: string) {
  const userId = await getUserId()
  await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
  revalidatePath('/applications')
}

// Audit Strategies
export async function getAuditStrategies() {
  const userId = await getUserId()
  return db
    .select()
    .from(auditStrategies)
    .where(eq(auditStrategies.userId, userId))
    .orderBy(desc(auditStrategies.createdAt))
}

export async function createAuditStrategy(data: any) {
  const userId = await getUserId()
  const id = generateRandomString()
  await db.insert(auditStrategies).values({
    id,
    userId,
    ...data,
  })
  revalidatePath('/audit-strategies')
  return { id }
}

export async function updateAuditStrategy(id: string, data: any) {
  const userId = await getUserId()
  await db
    .update(auditStrategies)
    .set(data)
    .where(
      and(eq(auditStrategies.id, id), eq(auditStrategies.userId, userId)),
    )
  revalidatePath('/audit-strategies')
}

export async function deleteAuditStrategy(id: string) {
  const userId = await getUserId()
  await db
    .delete(auditStrategies)
    .where(
      and(eq(auditStrategies.id, id), eq(auditStrategies.userId, userId)),
    )
  revalidatePath('/audit-strategies')
}

// Meetings
export async function getMeetings() {
  const userId = await getUserId()
  return db
    .select()
    .from(meetings)
    .where(eq(meetings.userId, userId))
    .orderBy(desc(meetings.createdAt))
}

export async function createMeeting(data: any) {
  const userId = await getUserId()
  const id = generateRandomString()
  await db.insert(meetings).values({
    id,
    userId,
    ...data,
  })
  revalidatePath('/meetings')
  return { id }
}

export async function updateMeeting(id: string, data: any) {
  const userId = await getUserId()
  await db
    .update(meetings)
    .set(data)
    .where(and(eq(meetings.id, id), eq(meetings.userId, userId)))
  revalidatePath('/meetings')
}

export async function deleteMeeting(id: string) {
  const userId = await getUserId()
  await db
    .delete(meetings)
    .where(and(eq(meetings.id, id), eq(meetings.userId, userId)))
  revalidatePath('/meetings')
}

// Dashboard Stats
export async function getDashboardStats() {
  const userId = await getUserId()

  const [
    functionsCount,
    entitiesCount,
    regulationsCount,
    applicationsCount,
    strategiesCount,
    meetingsCount,
  ] = await Promise.all([
    db
      .select({ count: organizationFunctions.id })
      .from(organizationFunctions)
      .where(eq(organizationFunctions.userId, userId)),
    db
      .select({ count: auditEntities.id })
      .from(auditEntities)
      .where(eq(auditEntities.userId, userId)),
    db
      .select({ count: regulations.id })
      .from(regulations)
      .where(eq(regulations.userId, userId)),
    db
      .select({ count: applications.id })
      .from(applications)
      .where(eq(applications.userId, userId)),
    db
      .select({ count: auditStrategies.id })
      .from(auditStrategies)
      .where(eq(auditStrategies.userId, userId)),
    db
      .select({ count: meetings.id })
      .from(meetings)
      .where(eq(meetings.userId, userId)),
  ])

  return {
    functionsCount: functionsCount[0]?.count || 0,
    entitiesCount: entitiesCount[0]?.count || 0,
    regulationsCount: regulationsCount[0]?.count || 0,
    applicationsCount: applicationsCount[0]?.count || 0,
    strategiesCount: strategiesCount[0]?.count || 0,
    meetingsCount: meetingsCount[0]?.count || 0,
  }
}

// User Management (Admin only)
export async function getAllUsers() {
  const userId = await getUserId()
  const role = await getUserRole(userId)

  if (role !== 'admin') {
    throw new Error('Admin access required')
  }

  // This would require additional setup, for now return empty
  return []
}

export async function setUserRole(targetUserId: string, role: 'admin' | 'user') {
  const userId = await getUserId()
  const userRole = await getUserRole(userId)

  if (userRole !== 'admin') {
    throw new Error('Admin access required')
  }

  const id = generateRandomString()
  await db
    .insert(userRoles)
    .values({ id, userId: targetUserId, role })
    .onConflictDoUpdate({
      target: userRoles.userId,
      set: { role },
    })

  revalidatePath('/admin/users')
}
