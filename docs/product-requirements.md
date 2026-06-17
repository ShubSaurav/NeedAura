# NeedAura - Product Requirements Document (PRD)

NeedAura is an AI-powered student super app and hyperlocal campus marketplace designed exclusively for verified college and university students.

---

## 🎯 Target Audience & Goals
- **Target Audience**: Active college students, moderators, campus vendor owners, and university administrators.
- **Primary Goal**: Facilitate secure, trust-based peer sharing (buy, sell, rent, borrow, exchange, donate) and collaboration (study notes, freelance services, roommate finding, ride matching) within verified student boundaries.
- **Core USP**: Strict college email verification, Google Gemini-powered visual listing generation, automated fraud detection, and the **Aura Score** gamification trust layer.

---

## 📋 Functional Requirements

### 1. Marketplace & Bidding
- **Multiple Listing Types**: Support for Sell (fixed price), Donate (free), Borrow/Rent (timed sharing), Exchange (item swaps), and Auction (real-time bidding).
- **Auction Engine**: Sellers can list auctions with a start price and expiration. Buyers place bids; prices update in real-time.
- **Pickup Zones**: Handovers must take place at designated, safe campus locations (e.g., library, cafeteria) chosen by the seller.

### 2. Need & AI Matching
- **Need Posting**: Students post immediate requirements (e.g. "DBMS notes", "Scientific calculator") with a maximum budget.
- **AI Match Engine**: Analyzes needs against current active listings (utilizing text search/embeddings) and flags matches.

### 3. AI Automation
- **Gemini Multimodal Vision**: Generates product titles, description copies, categories, and estimates condition scores (0-100%) based on photos.
- **Google Lens Price Comparison**: Searches and estimates retail value versus suggested resale prices.
- **Duplicate & Scam Check**: Flags duplicate listing images or suspicious prices before publishing.

### 4. Trust & Gamification
- **Domain Verification**: Enforces signup locks based on `@domain.edu` lists.
- **Aura Score & Badges**: Users earn points for completed trades, donations, and helpful reviews. Ranks are compiled onto leaderboards (University, Hostel, Branch).

---

## 🔒 Non-Functional & Security Requirements
- **Server Actions only**: All Gemini and database keys are stored and accessed exclusively on the server-side.
- **Row Level Security (RLS)**: Enforced at the PostgreSQL level.
- **Scale-Ready Folder Layout**: Separates the client code from server configurations, enabling clean migrations to NestJS microservices.
- **University Isolation**: Restricts students from seeing private listings from other universities unless explicitly shared.
