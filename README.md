# Asset-Tag-Database-2.0
Im restarting this project from fresh in order to solidify the process that Ive already undergone, and to update my SQL to better align with Microsoft SQL Server, instead of PostgreSQL

Currently using Supabase to design and test my backend database. Im tracking my work in VS Code with a structure that aligns with the eventual implementation of Microsoft SQL Server.

Below is a README from my past version of this project which is just as relevant to this current version.


## Project Overview
This project is an **Asset Tag Database** for tracking IT equipment across an undisclosed organization. The goal is to create a professional, MVP-ready web application that allows users to:

- View individual IT assets
- Add assets manually or via CSV import
- Search for single or multiple assets by criteria (model, department, status, etc.)
- Generate and download reports

The project is being developed with a **Supabase backend** and a **React frontend**. Supabase handles database storage, authentication, row-level security, and API generation, allowing focus on the frontend MVP.

---

## Project Structure
ASSET-TAG-DATABASE
 - backend
   - sql/
     - 01_schema.sql # Table structure: assets, import_logs
      - 02_policies.sql # Row-level security & access policies
      - 03_seed.sql # Example data for seeding the database
      - 04_queries.sql # Useful queries to interact with data
      - 05_utilities.sql # Verification, row counts, and maintenance scripts
    - assets_seed.csv # Example CSV for importing asset data
    - frontend
      - App.jsx
      - index.html
  - README.md

## Current Progress

### Backend (Supabase)


#### Files

- `01_schema.sql`: Defines the database schema (tables, columns, types)
- `02_policies.sql`: Row-Level Security policies for secure access
- `03_seed.sql`: Sample data for testing and development
- `04_queries.sql`: Common queries used in the app
- `05_utilities.sql`: Custom SQL functions for reporting and logic

#### How to Use

1. Run `01_schema.sql` in Supabase SQL Editor to create the schema.
2. Run `02_policies.sql` to enable RLS and define access rules.
3. Run `03_seed.sql` to populate the database with test data.
4. Use queries and functions as needed in your app.

- Supabase project created
- **Tables Created:**
  - `assets` (columns: id, asset_tag, pr, status, po, sn, model, dept, date_created, notes)
  - `import_logs` (columns: id, filename, imported_at, row_count, tracks CSV uploads)
- **Policies Implemented:**
  - Row-level security for authenticated users
  - Permissions for read, insert, update, and delete
- **Data Testing:**
  - CSV import tested
  - Queries tested for retrieving, filtering, and counting assets
- **Utilities:**
  - Verify table schema
  - Row counts
  - Truncate/delete data for testing


- VS Code project environment established
- GitHub connection establish for version control

---

## Next Steps
- ✅ Clean up Supabase SQL schema and policies
- ✅ Confirm CSV import works with `assets` table
- ✅ Scaffold frontend React app using Vite
- 🔲 Connect frontend to Supabase via JS client
- 🔲 Implement landing page: view assets, navigation, search
- 🔲 Implement import functionality from frontend
- 🔲 Implement report generation and download functionality
- 🔲 Review security, authentication, and access control
- 🔲 Deploy MVP and test workflow end-to-end

---

## Notes
- This project is being developed in an educational manner, learning how frontend and backend interact, CSV imports, and database schema design.
- Supabase is being used to streamline backend functionality while maintaining SQL and API exposure.
- CSV headers must match the table columns exactly for import.
- Queries in `04_queries.sql` act as a “temporary frontend” for testing data.
- Utilities in `05_utilities.sql` help verify the database and perform maintenance tasks.