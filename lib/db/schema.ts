import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  primaryKey,
  unique,
} from 'drizzle-orm/pg-core'

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
})

// User Roles for RBAC
export const userRoles = pgTable(
  'user_roles',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['admin', 'user'] }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique().on(table.userId)],
)

// Audit Knowledge Base Tables
export const organizationFunctions = pgTable('organization_functions', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', { enum: ['active', 'inactive', 'review'] })
    .notNull()
    .default('active'),
  owner: text('owner'),
  department: text('department'),
  riskLevel: text('riskLevel', { enum: ['high', 'medium', 'low'] }),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const auditEntities = pgTable('audit_entities', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', {
    enum: ['active', 'inactive', 'under_audit', 'pending_review'],
  })
    .notNull()
    .default('active'),
  entityType: text('entityType'),
  location: text('location'),
  riskRating: text('riskRating', { enum: ['critical', 'high', 'medium', 'low'] }),
  lastAuditDate: timestamp('lastAuditDate', { withTimezone: true }),
  nextAuditDate: timestamp('nextAuditDate', { withTimezone: true }),
  auditFrequency: text('auditFrequency'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const regulations = pgTable('regulations', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', {
    enum: ['active', 'inactive', 'archived', 'under_review'],
  })
    .notNull()
    .default('active'),
  regulationType: text('regulationType'),
  jurisdiction: text('jurisdiction'),
  effectiveDate: timestamp('effectiveDate', { withTimezone: true }),
  expiryDate: timestamp('expiryDate', { withTimezone: true }),
  complianceStatus: text('complianceStatus', {
    enum: ['compliant', 'non_compliant', 'partial_compliant', 'not_applicable'],
  }),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const applications = pgTable('applications', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', {
    enum: ['active', 'inactive', 'retired', 'in_development'],
  })
    .notNull()
    .default('active'),
  applicationOwner: text('applicationOwner'),
  riskClassification: text('riskClassification', {
    enum: ['critical', 'high', 'medium', 'low'],
  }),
  lastAuditDate: timestamp('lastAuditDate', { withTimezone: true }),
  nextScheduledAudit: timestamp('nextScheduledAudit', { withTimezone: true }),
  platform: text('platform'),
  dataClassification: text('dataClassification'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const auditStrategies = pgTable('audit_strategies', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', {
    enum: ['active', 'inactive', 'archived', 'in_progress'],
  })
    .notNull()
    .default('active'),
  strategyType: text('strategyType'),
  fiscalYear: text('fiscalYear'),
  focusAreas: text('focusAreas'),
  budget: text('budget'),
  resourcesRequired: text('resourcesRequired'),
  expectedOutcomes: text('expectedOutcomes'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const meetings = pgTable('meetings', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', {
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
  })
    .notNull()
    .default('scheduled'),
  meetingDate: timestamp('meetingDate', { withTimezone: true }).notNull(),
  meetingType: text('meetingType'),
  location: text('location'),
  attendees: text('attendees'),
  agenda: text('agenda'),
  notes: text('notes'),
  outcome: text('outcome'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
