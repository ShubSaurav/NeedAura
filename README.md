# NeedAura - AI-Powered Student Super App & Campus Marketplace

NeedAura is an AI-powered student support ecosystem and student marketplace designed exclusively for verified college and university students. The platform enables students to buy, sell, exchange, donate, borrow, rent, and request items, notes, roommate listings, and freelance services within a verified and hyperlocal campus network.

---

## 📂 Workspace Directory Structure

Our project is structured as an enterprise-grade split repository:

```
NeedAura/
│
├── frontend/             <-- Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion
│   ├── src/
│   │   ├── app/          <-- Pages, Layouts, CSS styles
│   │   ├── components/   <-- Reusable UI components (Button, Card, Input, Badge)
│   │   ├── lib/          <-- Supabase client-side configs
│   │   └── services/     <-- ListingService, UserService, ChatService, AIService
│   └── package.json
│
├── backend/
│   ├── database/         <-- Database migrations, schema.sql, rls.sql, seed.sql
│   ├── docs/             <-- API contracts, ER diagrams, architecture details
│   └── scripts/          <-- Custom seed/moderator tooling scripts
│
├── shared/               <-- Code shared across frontend & backend packages
│   ├── types/            <-- Shared TypeScript database interfaces
│   ├── constants/
│   └── utils/
│
├── docs/                 <-- Product requirement docs, roadmap, sprint-plans
│   ├── roadmap.md
│   ├── sprint-plan.md
│   └── product-requirements.md
│
├── .gitignore            <-- Configured Git ignores (excluding build cache, keys, nodes)
├── docker-compose.yml    <-- Local PostgreSQL (with pgvector) and Meilisearch containers
└── README.md
```

---

## 🛠️ Local Development Setup

### 1. Database & Infrastructure
To run a local PostgreSQL (with pgvector) and Meilisearch database, run:
```bash
docker-compose up -d
```
Alternatively, deploy the schemas directly to your online **Supabase Dashboard**:
1. Open your Supabase console SQL editor.
2. Execute the migration script: `backend/database/schema.sql`.
3. Execute the security script: `backend/database/rls.sql`.

### 2. Frontend Launch
To run the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Server Actions AI Keys
To enable Google Gemini and Vision image recognition:
1. Create a `frontend/.env.local` file.
2. Add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
*(Note: If no API key is specified, the application uses mock analysis in development mode).*
