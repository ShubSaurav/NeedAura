# NeedAura - Product Roadmap

This roadmap outlines the growth phases of NeedAura, expanding from a single-university MVP to a multi-campus, enterprise student super app.

---

## 📅 Roadmap Overview

```
[Phase 1: Foundation] ➔ [Phase 2: AI Listing Engine] ➔ [Phase 3: Community & Chat] ➔ [Phase 4: Gamification] ➔ [Phase 5: Payments & Scale]
```

---

## 🏁 Phase 1: Core Foundation & Identity Check (MVP)
* **Goal**: Establish campus bounds, secure user signup, and verify student identities.
* **Key Features**:
  - Sign-up restricted strictly to verified university domains (`university_domains`).
  - Private Student ID card upload layout.
  - Automated OCR card checking via Google Vision/Gemini.
  - Basic Profile setup displaying Aura points and verifications.

## 🤖 Phase 2: AI-Powered Listing Engine
* **Goal**: Launch the visual listing builder to differentiate from traditional marketplaces.
* **Key Features**:
  - Drag-and-drop item photo uploads.
  - Multimodal Gemini analysis: Auto-completes titles, categories, condition percentages, and descriptions.
  - Google Lens-style mock price checking (comparing resale values with online market values).
  - Fraud and duplicates flagging service checks.

## 💬 Phase 3: Peer Collaboration & Chat
* **Goal**: Enable direct interactions, negotiations, and roommate/ride matching.
* **Key Features**:
  - Safe, persistent negotiation chats between buyers and sellers.
  - Real-time updates via WebSockets/Supabase Realtime.
  - **Need Feed (USP)** matching system.
  - Ride-sharing and roommate matching hubs.

## 🏆 Phase 4: Branded Aura Gamification
* **Goal**: Incentivize trust, positive contributions, and campus safety.
* **Key Features**:
  - Dynamic Aura Score triggers (sale completions, reviews, donations).
  - Leaderboards (University-wide, Branch Circles, Hostel Halls).
  - Achievements and unlockable badge profiles (e.g. *Top Seller*, *Campus Helper*).

## 💳 Phase 5: Payments, Escrow & Monorepo Scaling
* **Goal**: Introduce monetary transactions, secure handovers, and transition backend services to NestJS.
* **Key Features**:
  - Payment gateway integrations (Razorpay, UPI, credit cards).
  - Escrow payments (holding funds securely until in-person pickup validation).
  - Verification of campus pickup zones using QR scans.
  - Migration of Server Actions into dedicated NestJS backend microservices.
