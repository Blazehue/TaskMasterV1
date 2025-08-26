import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  taskCount: integer('task_count').default(0),
  completedTasks: integer('completed_tasks').default(0),
  dueDate: text('due_date'),
  category: text('category'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  projectId: integer('project_id').references(() => projects.id),
  status: text('status').default('backlog'), // Updated to include kanban columns
  priority: text('priority').default('medium'),
  xpReward: integer('xp_reward').default(100),
  dueDate: text('due_date'),
  position: integer('position').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const upcomingTasks = sqliteTable('upcoming_tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  projectId: integer('project_id').references(() => projects.id),
  dueDate: text('due_date'),
  priority: text('priority').default('medium'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const calendarEvents = sqliteTable('calendar_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  taskId: integer('task_id').references(() => tasks.id),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  allDay: integer('all_day', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
