# NeedAura - API & Server Action Specification

NeedAura uses Next.js Server Actions (`"use server"`) as the primary backend logic layer. Server Actions act as secure, type-safe RPC endpoints that communicate directly with the database (Supabase PostgreSQL client) and execute API calls (like Google Gemini and FCM) without exposing environment secrets or API keys to the browser client.

---

## Architecture Flow

All client operations execute using this pattern:
```
[React Component] 
   --> calls [Server Action] 
         --> executes business logic inside [Service Layer]
               --> queries [Supabase PostgreSQL DB]
               --> calls [Google Gemini / Vision / FCM APIs]
```

---

## 1. Authentication & Verification Actions

### `signUpStudent`
Handles registration of new students, enforcing university domain validation.
- **Inputs**:
  ```typescript
  interface SignUpInput {
    email: string;       // Must match a domain in university_domains
    password: string;
    fullName: string;
    branch: string;
    hostel?: string;
  }
  ```
- **Returns**: `Promise<{ success: boolean; error?: string; message?: string }>`
- **Behavior**: Resolves domain checks against `university_domains`. If valid, triggers Supabase auth signup and logs metadata to `profiles`.

### `uploadStudentID`
Processes student ID uploads for verification.
- **Inputs**:
  ```typescript
  interface IDUploadInput {
    studentIdPublicUrl: string; // Public URL of the uploaded image
  }
  ```
- **Returns**: `Promise<{ success: boolean; error?: string; verifiedAutomatically: boolean }>`
- **Behavior**: Uses Gemini Vision to parse the ID card, match the name, and check expiration. If parsed successfully, sets `is_verified` to `true` (auto-verified), else queues for admin moderator review.

---

## 2. AI & Marketplace Actions

### `analyzeListingImage` (SECURE ACTION ONLY)
Uses Google Gemini and Vision API to auto-fill listings.
- **Inputs**:
  ```typescript
  interface ImageAnalysisInput {
    imageUrl: string; // Public URL from Supabase storage
  }
  ```
- **Returns**:
  ```typescript
  interface ImageAnalysisResult {
    success: boolean;
    title?: string;
    description?: string;
    category?: string;
    conditionScore?: number; // 0 - 100 percentage
    estimatedResaleValue?: number;
    scamConfidence?: 'low' | 'medium' | 'high';
  }
  ```
- **Behavior**: Extracts metadata from image using Gemini Vision, crawls mock prices, compares, and returns structured data safely.

### `createListing`
Inserts a new listing into the database.
- **Inputs**:
  ```typescript
  interface CreateListingInput {
    title: string;
    description: string;
    price: number;
    suggestedPrice?: number;
    marketPrice?: number;
    category: string;
    conditionScore: number;
    imageUrls: string[];
    listingType: 'buy' | 'sell' | 'exchange' | 'donate' | 'borrow' | 'rent' | 'auction';
    pickupZone: string;
    visibility: 'campus' | 'network' | 'public';
    auctionStartPrice?: number;
    auctionEndTime?: string; // ISO string if listingType is 'auction'
  }
  ```
- **Returns**: `Promise<{ success: boolean; listingId?: string; error?: string }>`

---

## 3. Needs & AI Match Engine Actions

### `postNeedRequirement`
Posts a student request and triggers the AI Match Engine.
- **Inputs**:
  ```typescript
  interface PostNeedInput {
    title: string;
    description: string;
    budget: number;
    category: string;
  }
  ```
- **Returns**: `Promise<{ success: boolean; needId?: string; matchesCount: number }>`
- **Behavior**: Saves the need post. Immediately queries listings matching category and budget within the university and triggers match notifications to relevant sellers.

---

## 4. Chats & Communication Actions

### `startNegotiationChat`
Initializes a chat thread between a buyer and listing owner.
- **Inputs**:
  ```typescript
  interface StartChatInput {
    listingId: string;
  }
  ```
- **Returns**: `Promise<{ success: boolean; chatId?: string; error?: string }>`

### `sendMessage`
Inserts a chat message and schedules an FCM notification.
- **Inputs**:
  ```typescript
  interface SendMessageInput {
    chatId: string;
    content: string;
  }
  ```
- **Returns**: `Promise<{ success: boolean; messageId?: string; error?: string }>`

---

## 5. Gamification, Reviews & Reporting Actions

### `submitUserReview`
Submits feedback after a completed trade, recalculating Aura Scores.
- **Inputs**:
  ```typescript
  interface SubmitReviewInput {
    listingId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number; // 1 to 5
    comment?: string;
  }
  ```
- **Returns**: `Promise<{ success: boolean; updatedAuraScore?: number }>`

### `reportContent`
Allows students to flag spam, fake items, or suspicious users.
- **Inputs**:
  ```typescript
  interface FileReportInput {
    reason: string;
    reportedUserId?: string;
    listingId?: string;
    needId?: string;
  }
  ```
- **Returns**: `Promise<{ success: boolean; reportId?: string }>`
