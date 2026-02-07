import { complaints, type Complaint, type InsertComplaint } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaintByTicket(ticketCode: string): Promise<Complaint | undefined>;
  getComplaints(): Promise<Complaint[]>;
  updateComplaintStatus(id: number, status: string): Promise<Complaint | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
  XXX
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000); 
    const ticketCode = `TKT-${year}-${random}`;

    const [complaint] = await db
      .insert(complaints)
      .values({ ...insertComplaint, ticketCode })
      .returning();
    return complaint;
  }

  async getComplaintByTicket(ticketCode: string): Promise<Complaint | undefined> {
    const [complaint] = await db
      .select()
      .from(complaints)
      .where(eq(complaints.ticketCode, ticketCode));
    return complaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    return await db.select().from(complaints).orderBy(complaints.createdAt);
  }

  async updateComplaintStatus(id: number, status: string): Promise<Complaint | undefined> {
    const [updated] = await db
      .update(complaints)
      .set({ status })
      .where(eq(complaints.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();

