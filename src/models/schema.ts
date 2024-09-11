import { sql, relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export type User = typeof users.$inferSelect;
export type UserRole = (typeof users.$inferSelect)['role'];
export type UserInsert = typeof users.$inferInsert;
export type UserExtended = User & { assessment: Assessment };
export type ApiPrices = Record<string, number>;
export const users = sqliteTable('users', {
  uid: text('uid').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  assistant_id: text('assistant_id'),
  vector_store_id: text('vector_store_id'),
  assessment_id: text('assessment_id'),
  mindset_score: integer('mindset_score'),
  password: text('password').notNull(),
  api_key: text('api_key').notNull(),
  known_as: text('known_as'),
  password_reset: integer('password_reset', { mode: 'boolean' }).default(true),
  credit_remaining: integer('credit_remaining').notNull().default(0),
  api_prices: text('api_prices', { mode: 'json' }).notNull().default({}),
  notes: text('notes').notNull().default(''),
  role: text('role', { enum: ['admin', 'client', 'delegate'] })
    .notNull()
    .default('client'),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  thread_id: text('thread_id'),
  owner_id: text('owner_id'),
  user_active: integer('user_active', { mode: 'boolean' }).notNull().default(true),
});
export const usersRelations = relations(users, ({ one }) => ({
  assessment: one(assessments, { fields: [users.assessment_id], references: [assessments.assessment_id] }),
  owner: one(users, { fields: [users.owner_id], references: [users.uid] }),
}));

export type Assessment = typeof assessments.$inferSelect;
export type AssessmentInsert = typeof assessments.$inferInsert;
export const assessments = sqliteTable('assessments', {
  assessment_id: text('assessment_id').primaryKey(),
  name: text('name').notNull(),
  transcript: text('transcript'),
  filename: text('filename').notNull(),
  status: text('status', { enum: ['pending', 'transcribing', 'processing', 'done', 'error'] }).default('pending'),
  agreeableness: integer('agreeableness').default(0),
  conscientiousness: integer('conscientiousness').default(0),
  extraversion: integer('extraversion').default(0),
  openness: integer('openness').default(0),
  neuroticism: integer('neuroticism').default(0),
  error: text('error').default(''),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Log = typeof logs.$inferSelect;
export type LogType = (typeof logs.$inferSelect)['type'];
export const logs = sqliteTable('logs', {
  log_id: text('log_id').primaryKey(),
  uid: text('uid').notNull(),
  assessment_id: text('assessment_id').notNull(),
  event: text('event').notNull(),
  message: text('message').notNull(),
  type: text('type', { enum: ['error', 'debug', 'info'] }).notNull(),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
