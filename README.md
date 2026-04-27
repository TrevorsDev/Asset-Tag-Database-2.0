# Asset Tag Database 2.0

[Deployed Link](https://asset-tag-database-2-0-87sy.vercel.app)

A rebuild of my original asset tracking system, designed to reinforce my understanding of full-stack development and improve SQL compatibility with Microsoft SQL Server. Built using **Supabase** (PostgreSQL) for the backend and **React (with Vite)** for the frontend.

The goal is a professional, MVP-ready web application that is ready to be adapted or refactored into an enterprise's current tech stack. It allows users to:

- View all IT assets in a searchable, live-updating table
- Add, edit, and delete assets via a polished modal form
- Search assets in real time across all fields
- Bulk-select and delete multiple assets
- Import assets via CSV with drag-and-drop, preview, and validation
- Export the full asset list as a CSV with a confirmation modal
- Interact with a fully keyboard-accessible UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| Styling | Plain CSS with design tokens, `@layer` cascade |
| CSV Parsing | PapaParse |
| Icons | Lucide React |

---

## Project Structure

```
Asset-Tag-Database-2.0/
├── backend/
│   └── sql/
│       ├── 01_schema.sql        # Table structure and unique constraints
│       ├── 02_policies.sql      # Row-level security and access control
│       ├── 03_seed.sql          # Sample data for local development
│       ├── 04_queries.sql       # Useful queries for interacting with data
│       └── 05_utilities.sql     # Verification, row counts, maintenance scripts
├── asset-tag-frontend/
│   ├── src/
│   │   ├── App.jsx              # Root controller — all state and data handlers
│   │   ├── App.css              # Global design tokens, utility classes, button variants
│   │   ├── hooks/
│   │   │   └── useAssets.js     # All Supabase CRUD operations
│   │   ├── utils/
│   │   │   └── validation.js    # Field-level form validation
│   │   └── components/
│   │       ├── AssetTable.jsx/css
│   │       ├── AssetModal.jsx/css
│   │       ├── AssetToolbar.jsx/css
│   │       ├── BulkDeleteBanner.jsx/css
│   │       ├── ConfirmDialog.jsx/css
│   │       ├── ExportModal.jsx/css
│   │       ├── Alert.jsx/css
│   │       ├── SearchBar.jsx
│   │       └── CSVUploader/
│   │           ├── CSVUploader.jsx
│   │           └── CSVUploader.css
│   └── vite.config.js
├── FUTURE_IMPROVEMENTS.md
└── README.md
```

---

## How to Run Locally

```bash
cd asset-tag-frontend
npm install
npm run dev
```

Requires a `.env` file inside `asset-tag-frontend/` with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Open your browser to `http://localhost:5173`

---

## What's Built (v1.0)

### Backend
- Assets table with UUID primary keys and unique constraints on `asset_tag` and `serial_number`
- Row-level security configured via Supabase policies
- Seed data and utility SQL scripts included
- Upsert logic for CSV bulk imports
- Database rejects conflicting serial numbers or asset tags to maintain integrity

### Frontend

**Asset Table**
- Live data from Supabase with search filtering across all fields
- ProtonMail-style hover-activated row actions (edit, delete)
- Gmail-style checkbox selection system — hover reveals checkbox, checking one enters selection mode and reveals all checkboxes

**Add / Edit Modal**
- Controlled form with field-level inline validation
- Blur re-validation after first submit attempt
- Duplicate constraint errors surface with human-readable messages
- Separate titles for Add vs Edit mode

**Bulk Delete**
- Sticky banner that smoothly animates in between the toolbar and table
- Auto-dismisses when the last checkbox is unchecked
- Confirmation dialog before any destructive action

**CSV Upload**
- Drag-and-drop modal with `PapaParse` for reliable parsing
- Header normalization maps inconsistent column names to database fields
- Preview table shown before committing — prevents accidental imports
- Error handling for invalid file types, empty files, and database constraint violations

**CSV Export**
- Confirmation modal shows record count, filename, and columns before download
- Triggers a clean browser download with no page reload

**Design System**
- Single CSS source of truth (`App.css`) using `@layer base → components → utility`
- Design tokens for all colors, spacing, shadows, and typography
- Global button variants: `primary-btn`, `secondary-btn`, `danger-btn`
- Global focus ring utilities: `focus-ring--action` (blue), `focus-ring--danger` (red)
- Shared `modal-close-btn` used consistently across all three modals
- No `window.confirm()` or `alert()` anywhere — all replaced with React components

### Architecture
- All state lives in `App.jsx` and is passed down via props (flat, predictable component tree)
- `useAssets.js` acts as a data access layer — components call named functions and never touch Supabase directly
- `validation.js` handles all form validation logic, imported where needed

---

## Next Steps

See [FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md) for the full roadmap, including:

- Toast notifications for CRUD feedback
- Pre-flight duplicate detection with specific conflict messaging
- React Context migration as the component tree grows
- Authentication and role-based access control
- MS SQL Server migration (v2.0)
- Reporting dashboards and analytics
- TypeScript adoption
