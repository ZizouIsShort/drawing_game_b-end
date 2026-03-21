import {
  pgTable,
  varchar,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const strokes = pgTable("strokes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  roomId: text("room_id").notNull(),

  prevX: integer("prev_x").notNull(),
  prevY: integer("prev_y").notNull(),

  x: integer("x").notNull(),
  y: integer("y").notNull(),

  color: text("color"),
  width: integer("width"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  roomId: text("room_id").notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
