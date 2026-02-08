import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  ticketCode: text("ticket_code").notNull().unique(), // TKT-2026-XXXXX
  name: text("name").notNull(),
  mobile: text("mobile").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  area: text("area").notNull(),
  status: text("status").notNull().default("SUBMITTED"), // SUBMITTED, IN_PROGRESS, RESOLVED
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({ 
  id: true, 
  ticketCode: true, 
  createdAt: true 
});

export const updateStatusSchema = z.object({
  status: z.enum(["SUBMITTED", "IN_PROGRESS", "RESOLVED"])
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

