import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Create Complaint
  app.post(api.complaints.create.path, async (req, res) => {
    try {
      const input = api.complaints.create.input.parse(req.body);
      const complaint = await storage.createComplaint(input);
      res.status(201).json(complaint);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Search Complaint by Ticket
  app.get(api.complaints.search.path, async (req, res) => {
    const ticket = req.query.ticket as string;
    if (!ticket) {
      return res.status(400).json({ message: "Ticket ID required" });
    }
    const complaint = await storage.getComplaintByTicket(ticket);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  });

  // List All Complaints
  app.get(api.complaints.list.path, async (req, res) => {
    const complaints = await storage.getComplaints();
    res.json(complaints);
  });

  // Update Status
  app.patch(api.complaints.updateStatus.path, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const input = api.complaints.updateStatus.input.parse(req.body);
      const updated = await storage.updateComplaintStatus(id, input.status);
      if (!updated) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Admin Login (Hardcoded)
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      if (username === "admin" && password === "admin") {
        return res.json({ success: true });
      }
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Seed Data
  const existing = await storage.getComplaints();
  if (existing.length === 0) {
    console.log("Seeding database...");
    await storage.createComplaint({
      name: "John Doe",
      mobile: "9876543210",
      category: "Roads",
      description: "Huge pothole on Main St near the post office.",
      area: "Downtown",
      status: "SUBMITTED"
    });
    // Manually update the second one to IN_PROGRESS since createComplaint might not expose status if I omitted it, ticketCode, createdAt. Status is there.
    await storage.createComplaint({
      name: "Jane Smith",
      mobile: "9123456780",
      category: "Water Supply",
      description: "No water supply since yesterday morning.",
      area: "Uptown",
      status: "IN_PROGRESS"
    });
    console.log("Database seeded.");
  }

  return httpServer;
}

