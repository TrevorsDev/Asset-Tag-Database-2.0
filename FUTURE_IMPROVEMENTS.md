# Future Improvements

This document outlines deeper architectural plans, technical enhancements, and long-term improvements for the Asset Tag Database project. Items marked ✅ are complete in v1.0.

---

## App Architecture

### ✅ Custom Hooks & Modularization
- `useAssets.js` handles all Supabase CRUD operations as a dedicated data access layer
- `validation.js` extracted as a standalone utility module
- CSV parsing handled inside `CSVUploader` component

### React Context Migration
- Replace prop drilling with React Context as the component tree grows
- Centralize shared state (assets, filters, auth session)
- `App.jsx` is the natural starting point — all state already lives there, migration is mechanical

### Data Table Virtualization
- Migrate `AssetTable` to a virtualized list (e.g., TanStack Virtual or `react-window`) for datasets of 10,000+ rows
- Current HTML `<table>` works well for hundreds of rows but will degrade at scale

### Type Safety & Testing
- Add PropTypes or migrate to TypeScript
- Unit tests for `validation.js`, CSV parsing logic, and form submission
- Integration tests for upload and edit workflows

---

## Search & Filtering

- Debounced search input to reduce re-renders on fast typing
- Server-side search for large datasets (currently client-side filtered)
- Empty-state messaging ("No assets match your search")
- Column-specific filtering (filter by department, status, etc.)
- Pagination or infinite scroll for large datasets

---

## Feedback & Notifications

### Toast Notifications (next up)
- Success toast for: add asset, edit asset, delete, bulk delete, CSV upload, CSV export
- Slides up from bottom center, auto-dismisses after 3 seconds
- Error stays inline in context (modal or banner) — only success gets a toast

### Duplicate Detection (next up)
- Pre-flight validation against local assets array before calling Supabase
- Show exactly which asset tag or serial number conflicts and which existing record owns it
- Example: "Serial number SN-JKL32122 is already assigned to AT-3000143"

---

## CSV Import

### ✅ Completed in v1.0
- Drag-and-drop upload zone
- Preview table before committing data
- PapaParse integration with `transformHeader` column normalization
- Error handling for invalid file types, empty CSVs, and database constraint violations

### Remaining
- Row-level error reporting (line numbers for failed rows)
- Upload progress indicator for large files
- Schema validation (required columns, type checking)
- Audit logging for bulk imports

---

## CSV Export

### ✅ Completed in v1.0
- Export confirmation modal showing record count, filename, and columns
- Full dataset download as `.csv`

### Remaining
- Export filtered results only (respects current search)
- Excel format support (`.xlsx`)
- Scheduled exports for finance or management reporting

---

## Asset Management

### ✅ Completed in v1.0
- Inline validation for add/edit modal fields
- Bulk delete with checkbox selection and sticky confirmation banner
- `ConfirmDialog` component replaces all `window.confirm()` calls
- Smooth animated bulk-delete banner that auto-dismisses when unchecked

### Remaining
- Prevent accidental modal close when form has unsaved changes
- Bulk update (change status or department across multiple assets at once)
- Audit logging for edits and deletes (who changed what and when)
- Asset history / change log view per record

---

## UI/UX

### ✅ Completed in v1.0
- Dark theme with blue-slate design tokens
- Standardized button variants (`primary-btn`, `secondary-btn`, `danger-btn`)
- Global focus ring system (`focus-ring--action`, `focus-ring--danger`)
- Consistent modal close button (`modal-close-btn`) across all modals
- Sticky bulk-delete banner with smooth CSS transition animation

### Remaining
- Loading skeletons or spinners during Supabase fetch
- Empty-state illustration or message when no assets exist
- Mobile responsiveness pass
- Keyboard navigation improvements (trap focus inside modals)

---

## Security & Authentication

- Supabase Auth (email/password or OAuth)
- Role-based access control: Admin (full CRUD) vs Read-Only (view and export only)
- Protected routes and session persistence
- Password reset and email verification flows
- Re-enable RLS policies (currently disabled for public demo)

---

## MS SQL Server Migration (v2.0)

- Migrate database from Supabase (PostgreSQL) to MS SQL Server
- Build a Node/Express REST API layer between the frontend and MSSQL
- Replace Supabase client calls in `useAssets.js` with `fetch()` calls to the API — frontend components unchanged
- Add stored procedures for upsert and bulk operations
- Add SQL triggers for data normalization and audit logging
- This is the primary requirement for enterprise/government deployment

---

## Reporting & Analytics

- Department breakdown (assets per department, pie/bar chart)
- Asset lifecycle status dashboard (active vs inactive vs retired)
- Exportable PDF reports
- Scheduled email reports for management

---

## Deployment & Reliability

- ✅ Deployed to Vercel
- Error boundaries to prevent full-page crashes in production
- Environment variable audit (ensure no keys exposed client-side)
- Logging and monitoring (Sentry or similar)
- CI/CD pipeline (auto-deploy on merge to main)
