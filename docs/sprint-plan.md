# NeedAura - Sprint Execution Plan

This sprint plan lists tasks, dependencies, and owners for building the first functional version of NeedAura.

---

## 🏃 Sprint 1: Architecture, DB Restructuring, & Core Foundation (Current)
* **Objective**: Establish folders, set up Next.js 15, configure Tailwind v4, write SQL scripts, and establish type safety.
* **Status**: **100% Completed** ✅

### Completed Tasks
- [x] Restructured directories into `frontend/`, `backend/`, `shared/`, and `docs/`.
- [x] Created `backend/database/schema.sql` and `backend/database/rls.sql`.
- [x] Wrote `backend/docs/er-diagram.md`, `backend/docs/api-spec.md`, and `backend/docs/ui-screen-inventory.md`.
- [x] Bootstrapped Next.js 15 inside `frontend/` and configured `@tailwindcss/postcss` for Tailwind v4.
- [x] Created custom glowing and glassmorphic UI components.
- [x] Created Service Layer (`ListingService`, `UserService`, `ChatService`, `AIService`).
- [x] Tested production build with `npm run build` inside `frontend/`.

---

## 🏃 Sprint 2: User Onboarding, Email Lock, & Profiles
* **Objective**: Build login and sign-up with email domain verification, set up student ID image upload flows, and render verified profiles.
* **Duration**: 2 Weeks

### Backlog Tasks
1. **Database Integrations**:
   - Run `schema.sql` and `rls.sql` migrations on your Supabase dashboard.
   - Seed initial universities and domains.
2. **Onboarding Frontend**:
   - Build Landing page with glowing buttons and Vercel-style aesthetics.
   - Build Signup form with domain checks matching domain list.
3. **Student ID Upload & OCR**:
   - Create ID card drag-and-drop file upload screen.
   - Implement `uploadStudentID` Server Action calling Gemini Vision to auto-verify names and IDs.
4. **Student Profiles Dashboard**:
   - Create user profile layout displaying Aura Score, verified badges, and campus details.
