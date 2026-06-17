# NeedAura - UI Screen Inventory & Architecture

This document inventories the frontend screens and outlines layout styles inspired by **Linear/Vercel/Notion** dark mode.

---

## Global Design Standards
- **Global Theme**: Dark-mode default with glowing neon borders.
- **Glassmorphic Cards**: `backdrop-filter: blur(12px) saturate(180%); background-color: rgba(13, 18, 30, 0.65);`
- **Typography**: Inter (UI elements) combined with Space Grotesk (headers & scores).

---

## 1. Public & Onboarding Views

### 1.1 Landing / Welcome Screen
- **Core Elements**:
  - Hero header with Space Grotesk tagline: *"The AI-Powered Campus Super App."*
  - Glowing call-to-action button (Electric Blue border glow).
  - Search/Selection bar to look up participating universities.
  - Interactive grid displaying mock marketplace items (showing automatic Lens price comparison details).
- **Layout**: Full-screen landing structure, background starfields, animated canvas flows.

### 1.2 Sign-Up / Domain Check Screen
- **Core Elements**:
  - Split view structure: Logo and key stats on the left, sign-up forms on the right.
  - Live email validation indicator (automatically checks input text against verified university domains).
  - Credentials password requirements checklists.

### 1.3 Student ID Upload Page
- **Core Elements**:
  - Drag-and-drop region for Student ID card image (supports `.png`, `.jpg`, `.pdf`).
  - Progress tracker showing AI OCR parsing state.
  - Auto-verification message or "Moderation pending" notification card.

---

## 2. Core Dashboard & Marketplace Views

### 2.1 Student Dashboard (Aura Hub)
- **Core Elements**:
  - Side navigation (Vercel-style, low-profile sidebar).
  - Header showing current Aura Score (e.g. 100 points, "Level 2 Seller" badge).
  - Quick action grid: "Post Listing", "Need Something", "Lost & Found", "SOS Emergency".
  - **Aura Feed**: Micro-post feed of recent items listed in the student's campus.

### 2.2 Marketplace Feed
- **Core Elements**:
  - Layout: Left side has category filters (Books, Notes, Hostel essentials, Electronics, Cycles) and Visibility filter (Campus, Network, Public).
  - Right side has listing cards. Each listing card contains:
    - Glowing state badge (listing type: "Sell", "Donate", "Rent", "Auction").
    - Condition score percentage badge (e.g. "92% Condition").
    - Title, price, pickup zone indicator.
  - Click details: Overlay modal detailing the listing, pickup points, seller's verified review history, and a "Start Chat" or "Place Bid" button.

### 2.3 Listing Creation Form (With AI Assist)
- **Core Elements**:
  - Drag-and-drop image uploader.
  - Loading skeleton trigger: "Gemini is analyzing your product...".
  - AI results panel showing generated title, category, description, and condition.
  - Price slider showing Suggested price vs. online market values (Google Lens results).
  - Pickup zone selection dropdown (Library, Student Center, Cafeteria).

---

## 3. Collaboration & Community Feeds

### 3.1 Need Module Feed
- **Core Elements**:
  - Active lists of posted needs (e.g., "Casio Calculator, Budget ₹400").
  - "I have this!" trigger button initiating chat.
  - Match Indicator: green badge showing "AI Match Found: 2 Listings available".

### 3.2 Chat & Negotiator Suite
- **Core Elements**:
  - Master-detail view: Inbox threads listing on the left (showing last message and unread count), chat bubble window on the right.
  - Inside Chat: Header showing listing status, current item details, and quick buttons to create transactions (e.g. "Mark as Sold").
  - Bubble chats with green read/unread indicators.

### 3.3 Skill & Team Finder Portal
- **Core Elements**:
  - Dual feeds: "Skill Swap" (peer exchange items) and "Project Team Up" (Hackathons/competitions).
  - Filters matching roles (AI Engineer, UI Designer, Web Developer).

---

## 4. Moderation & Vendor Portals

### 4.1 Moderation Dashboard
- **Core Elements**:
  - Visible only to `moderator` and `university_admin` roles.
  - "Pending ID Cards" queue showing uploads alongside OCR comparison data. Action buttons: Approve / Reject.
  - "User Reports" resolution tab (managing flagged listings/comments).

### 4.2 Vendor Showcase & Product Editor
- **Core Elements**:
  - Dedicated tab displaying campus stores.
  - For store owners: inventory lists with stock totals and fast update triggers.
