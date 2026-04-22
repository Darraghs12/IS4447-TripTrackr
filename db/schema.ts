import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  colour: text('colour').notNull(),
  icon: text('icon').notNull().default('map-outline'),
});

export const trips = sqliteTable('trips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  destination: text('destination').notNull(),
  startDate: text('startDate').notNull(),
  endDate: text('endDate').notNull(),
  categoryId: integer('categoryId'),
  notes: text('notes'),
});

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('tripId').notNull(),
  name: text('name').notNull(),
  date: text('date').notNull(),
  duration: integer('duration').notNull(),
  metric: text('metric').notNull(),
  categoryId: integer('categoryId'),
  notes: text('notes'),
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  categoryId: integer('categoryId'),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: text('createdAt').notNull(),
});
