# Improvements for Future Iterations

This document outlines deeper architectural plans, technical enhancements, and long-term improvements for the Asset Tag Database project. These items go beyond the MVP and reflect enterprise-level engineering goals.

---

## 🏗️ App Architecture

### 🔄 Switch from Props to React Context
- Reduce prop drilling as the app grows
- Centralize shared state (filters, assets, auth)
- Cleaner architecture for large systems

### 🧩 Custom Hooks & Modularization
- Move filtering logic into a dedicated custom hook
- Extract CSV parser into its own utility module
- Add a dedicated hook for asset CRUD operations
- Add a hook for authentication and session management

### 🧪 Type Safety & Testing
- Add PropTypes or migrate to TypeScript
- Add unit tests for filters, CSV parsing, and form validation
- Add integration tests for upload and edit workflows

---

## 🔎 Filtering & Search Enhancements

- Debounced text input to improve performance
- “Clear All Filters” button
- Empty-state messaging (“No assets match your search”)
- Multi-column filtering logic
- Styling improvements for FiltersBar
- Add column sorting (A–Z, Z–A)
- Add pagination or infinite scroll for large datasets

---

## 📝 CSV File Uploading

### Parsing & Validation
- Add preview table before submitting CSV data
- Add row-level error reporting (line numbers, conflicting serial numbers)
- Add schema validation (required columns, type checking)
- Auto-column detection using SQL `information_schema`
- Add drag-and-drop upload zone
- Add upload progress bar

### Backend Integration
- Support uploading parsed data to SQL Server (v2.0)
- Add server-side validation for malformed rows
- Add audit logging for bulk imports

---

## 📤 CSV File Exporting

- Add “Download Report” button
- Export filtered results
- Export full dataset
- Support CSV and Excel formats
- Add scheduled exports for finance teams

---

## ✏️ Editing & Asset Management

- Inline validation for edit modal fields
- Prevent accidental modal close when form is dirty
- Add toast notifications (“Asset updated successfully”)
- Add bulk delete or bulk update actions
- Add audit logging for edits and deletes

---

## 🎨 UI/UX Improvements

- Standardize button styles across the app
- Add dark mode
- Improve mobile responsiveness
- Add loading spinners and skeleton states
- Add empty-state illustrations or messaging

---

## 🛡️ Security & Authentication

- Add Supabase Auth (email/password or OAuth)
- Add role-based access control (Admin vs Read-Only)
- Add protected routes and session persistence
- Add password reset and email verification flows

---

## 🗄️ MS SQL Server Migration (Version 2.0)

- Migrate database from Supabase (PostgreSQL) to MS SQL Server
- Maintain identical UI and frontend logic
- Update backend queries and upsert logic
- Add stored procedures for enterprise workflows
- Add SQL triggers for trimming and data normalization

---

## 📊 Reporting & Analytics

- Add dashboards (assets by department, lifecycle status)
- Add charts (Pie, Bar, Line)
- Add exportable PDF reports
- Add scheduled email reports

---

## 🧭 Deployment & Monitoring

- Deploy MVP to production (Netlify, Vercel, or Supabase)
- Add environment variable management
- Add error boundaries for production safety
- Add logging and monitoring (Sentry, Supabase logs)
