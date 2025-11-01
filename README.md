# Asset-Tag-Database-2.0
Im restarting this project from fresh in order to solidify the process that Ive already undergone, and to update my SQL to better align with Microsoft SQL Server, instead of PostgreSQL

Currently using Supabase to design and test my backend database. Im tracking my work in VS Code with a structure that aligns with the eventual implementation of Microsoft SQL Server.

Below is a README from my past version of this project which is just as relevant to this current version.


# Asset-Tag-Database-2.0

This project is a rebuild of my original asset tracking system, designed to reinforce my understanding of full-stack development and improve SQL compatibility with Microsoft SQL Server. I'm currently using **Supabase** for backend development and **React (with Vite)** for the frontend.

The goal is to create a professional, MVP-ready web application that allows users to:

- View individual IT assets
- Add assets manually via a frontend form
- Search for assets by criteria (model, department, status, etc.)
- Generate and download reports
- Eventually support CSV import and user authentication

---

## 🧱 Project Structure

Asset_Tag_Database_2.0/
├── backend/
│   └── sql/
│       ├── 01_schema.sql         # Table structure: assets
│       ├── 02_policies.sql       # Row-level security & access policies
│       ├── 03_seed.sql           # Example data for seeding the database
│       ├── 04_queries.sql        # Useful queries to interact with data
│       └── 05_utilities.sql      # Verification, row counts, and maintenance scripts
├── asset-tag-frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── supabaseClient.js    # Supabase connection setup
│   │   └── assets/              # Static assets
│   ├── .env                     # Supabase URL and API key
│   ├── package.json
│   └── vite.config.js
└── README.md

---

## ✅ Current Progress

### 🔧 Backend (Supabase)

- **Tables Created:**
  - `assets` (columns: id, asset_tag, pr, status, po, serial_number, model, department, created_at)
- **Policies Implemented:**
  - Row-level security enabled
  - Public read access temporarily allowed for development
- **Seed Data:**
  - Sample assets inserted for testing
- **Utilities:**
  - Row count checks
  - Schema verification
  - Truncate/reset scripts

### 💻 Frontend (React + Vite)

- Supabase client configured using environment variables
- Asset data fetched and displayed in a table
- Loading state and empty state messages implemented
- Form UI in progress for adding new assets

---

## 🚀 How to Run the App

1. Clone the repo and open in VS Code
2. Navigate to the frontend folder:
   ```bash
   cd asset-tag-frontend

3. Install dependencies:
  1 npm install

4. Start the development server:
  1 npm run dev

5. Open your browser to http://localhost:5173


## Next Steps
- ✅ Connect frontend to Supabase
- ✅ Display asset data in a table
- 🔲 Complete form to add new assets
- 🔲 Add form validation and error handling
- 🔲 Implement search/filter functionality
- 🔲 Add CSV import support
- 🔲 Add authentication and secure access
- 🔲 Deploy MVP and test full workflow
---

## Notes
- This project is being developed in an educational manner, learning how frontend and backend interact, CSV imports, and database schema design.
- Supabase is being used to streamline backend functionality while maintaining SQL and API exposure.
- CSV headers must match the table columns exactly for import.
- Queries in '04_queries.sql' are used for testing and development.
- Utilities in `05_utilities.sql` help verify the database and perform maintenance tasks.
- The frontend is built using React with Vite for fast development and hot module reloading.
- In order to run the program, make sure you cd into asset-tag-frontend and then run npm run dev in order to connect to localhost:5173