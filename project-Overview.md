Here is the overview of project 

# City Complain Portal

Smart City Complaint & Issue Reporting System

## Project Overview
This project allows citizens to raise city-related complaints and track them using a unique complaint ID.
City authority workers can log in to manage, track, and resolve complaints.

## Phases
### Phase 1: Public Complaint Portal
- Submit complaint
- Generate unique complaint ID
- Track complaint status

### Phase 2: City Authority Portal
- Worker login
- View assigned complaints
- Update complaint status
- Add remarks and resolution proof

## Tech Stack
(To be added)
city-complain-portal/
│
├── backend/
│   └── README.md
│
├── frontend/
│   └── README.md
│
└── docs/
    └── project-plan.md
    Public side
Public User
   ↓
Complaint Form Submit
   ↓
System generates Ticket ID
   ↓
Complaint saved in Database
   ↓
Ticket ID shown to user
example-TKT-2026-00045
NOW Development Authority.
SUBMITTED → IN_PROGRESS → RESOLVED → CLOSED


## System Design (How it Works)

This project is designed with a simple two-entity architecture.

Public users can submit city-related complaints without creating an account.
Once a complaint is submitted, the system generates a unique ticket ID that can be used to track the complaint status.

The City Development Authority operates through a single secure admin account.
All complaints submitted by the public are stored in a centralized database and are visible on the authority dashboard.
The authority manually reviews each complaint and updates its status.

There is no direct interaction between users and the authority.
All communication happens through the system using ticket IDs and status updates.
