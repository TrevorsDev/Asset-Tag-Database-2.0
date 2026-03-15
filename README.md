# Asset-Tag-Database-2.0

This project is a rebuild of my original asset tracking system, designed to reinforce my understanding of full-stack development and improve SQL compatibility with Microsoft SQL Server. I'm currently using **Supabase** (PostgreSQL) for backend development and **React (with Vite)** for the frontend.

The goal is to create a professional, MVP-ready web application that is ready to be adapted or refactored into an enterprise's current tech stack. Most importantly it should allow users to:

- View individual IT assets
- Add, remove, and update assets manually via a frontend form
- Search and filter assets by column (e.g., model, department, status)
- Generate and download reports
- Import assets via CSV (with Upsert logic)
- Authenticate users and restrict access

---

## 🧱 Project Structure
```
Asset_Tag_Database_2.0/ 
├── backend/ 
└── sql/ 
│ ├── 01_schema.sql         # Table structure: assets
│ ├── 02_policies.sql       # Row-level security & access
│ ├── 03_seed.sql           # Example data for seeding
│ ├── 04_queries.sql        # Useful queries to interact with data
│ └── 05_utilities.sql      # Verification, row counts, and maintenance scripts
├── asset-tag-frontend/ 
│ ├── public/ 
│ ├── src/ 
│ │ ├── App.jsx             # Main React component
│ │ ├── components/ 
│ │ │ ├── AssetForm.jsx 
│ │ │ ├── AssetTable.jsx
│ │ │ ├── CSVUploader/ # CSV Import component & styles  
│ │ │ └── (filter components coming soon) 
│ │ ├── hooks/ 
│ │ │ └── useAssets.js 
│ │ ├── utils/ 
│ │ │ └── validation.js 
│ │ ├── supabaseClient.js 
│ ├── .env 
│ ├── package.json 
│ └── vite.config.js

```
---

## ✅ Current Progress

### 🔧 Backend (Supabase)
- Fully implemented assets table with UUID PKs and unique constraints.

- Row‑level security configured.

- Seed data and utility SQL scripts included.

- Upsert logic prepared for CSV imports.

- Database rejects conflicting serial numbers or asset tags to maintain integrity.

### 💻 Frontend (React + Vite)
- Asset table with live Supabase data.

- Asset creation form with validation.

- Centralized filtering system (FiltersBar + ColumnFilter).

- Fully refactored CSVUploader with:

   - Custom CSV parser

   - Header normalization

   - Two‑stage review

   - Strict validation

   - Smart error handling

   - Centralized reset logic

   - Professional file input behavior

### 🎨 UI/UX
- Semantic HTML for accessibility.

- Reusable button styles.

- Reusable ```<Alert />``` component for success/error messaging.

- Clean, consistent layout across components.

### ⚔️ Code Standards
- Semantic HTML: Prioritizes the use of descriptive tags (`<section>`, `<label>`, `<p>`) over generic `<div>` nesting to improve accessibility and SEO.

- **Data Management:** Custom `useAssets` hook manages fetching and bulk data operations.

### ✅ FiltersBar Component & ColumnFilter Abstraction

#### FilterBar
- Introduced a centralized `FiltersBar` component to manage all column filters.
- Uses a reusable `ColumnFilter` component for both dropdown and text input filters.
- Filters are driven by a config array for scalability and maintainability.

#### ColumnFilter
- A reusable abstraction that:

   - Accepts filter type (select or text).

   - Accepts dynamic options.

   - Emits filter changes back to the parent.

   - Keeps the code DRY and maintainable.

### ✅ CSVUploader Component
The CSVUploader is a fully refactored, production‑ready bulk import tool designed for reliability, clarity, and user‑friendly error handling.

#### Key Features
#### 📄 Custom CSV Parsing Engine
Built using the browser’s native FileReader API — no third‑party libraries.

- Handles thousands of rows efficiently.

- Skips blank lines and malformed rows.

- Validates that the CSV contains both headers and data rows.

#### 🧭 Header Normalization Layer
- Automatically maps inconsistent CSV headers (e.g., sn, serial, dept, department) into database‑compliant column names. This allows non‑technical staff to upload files without strict formatting.

#### 🧪 Two‑Stage Review Workflow
- Upload CSV → Preview row count

- Confirm & Upload → Commit to database

- This prevents accidental imports and gives users confidence before writing to the database.

#### 🛡️ Strict Data Integrity Enforcement
- Validates uniqueness of Asset Tags and Serial Numbers.

- Database rejects conflicting rows to prevent corruption.

- Clear messaging explains why a row failed.

#### 🎯 Smart Error Handling
- Local Errors: invalid file type, empty CSV, malformed rows, missing headers.

- Database Errors: constraint violations, duplicates, or Supabase rejections.

- Errors are displayed through a unified ```<Alert />``` component.

#### 🔁 Professional File Input Behavior
The uploader now handles all edge cases cleanly:

- Users can re‑select the same file after Cancel, error, or success.

- File input resets automatically after every action.

- No need to refresh the page to retry an upload.

#### 🧹 Centralized Reset Logic
- All resets (file input, errors, preview, success state) are handled through dedicated helper functions:

   - resetFileInput()

   - clearAllErrors()

   - resetState()

   - This reduces duplication and makes the component easier to maintain.

### 🧠 Architecture & Code Quality Improvements
#### State Management
- All CSVUploader state transitions are now predictable and centralized.

- Error states are separated into local vs external (database) for clarity.

- File input resets are handled consistently across all user actions.

#### UX Enhancements
- Clear success and error alerts using a reusable ```<Alert />``` component.

- “Change File” button appears only when appropriate.

- Cancel button now fully resets the uploader.

- Prevents users from uploading malformed or empty CSVs.

#### Error Safety
- No partial writes.

- No silent failures.

- No corrupted data.

- Users always know what happened and why.
---

## 🚀 How to Run the App

1. Clone the repo and open in VS Code
2. Navigate to the frontend folder:
   ```bash
   cd asset-tag-frontend
3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

5. Open your browser to http://localhost:5173

---
## 🚀 Next Steps

### 🔐 Authentication & Security
- Add Supabase Auth (email/password or OAuth)
- Add protected routes and session handling
- Add role-based access control (Admin vs Read-Only)

### 🧭 Filtering Enhancements
- Style the FiltersBar to match the asset table
- Add a “Clear All Filters” button
- Add loading and empty-state messaging
- Add multi-column filtering (e.g., Status + Department)

### 📄 CSV Import Enhancements
- Add optional preview table (first 5–10 rows)
- Add drag-and-drop upload zone
- Add CSV export functionality
- Add schema validation for required columns

### 🛠 Asset Management
- Add inline editing improvements
- Add bulk delete or bulk update actions
- Add audit logging (who changed what and when)

### 🌐 Deployment
- Deploy MVP to production
- Configure environment variables for production
- Test full workflow with real users

---
For deeper architectural plans and long-term enhancements, see  
📘 **[Future Improvements](./FUTURE_IMPROVEMENTS.md)**


