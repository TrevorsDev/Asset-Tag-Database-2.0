# Asset-Tag-Database-2.0
Im restarting this project from fresh in order to solidify the process that Ive already undergone, and to update my SQL to better align with Microsoft SQL Server, instead of PostgreSQL

Currently using Supabase to design and test my backend database. Im tracking my work in VS Code with a structure that aligns with the eventual implementation of Microsoft SQL Server.

Below is a README from my past version of this project which is just as relevant to this current version.


## About this Build

This project is a rebuild of my original asset tracking system, designed to reinforce my understanding of full-stack development and improve SQL compatibility with Microsoft SQL Server. I'm currently using **Supabase** for backend development and **React (with Vite)** for the frontend.

The goal is to create a professional, MVP-ready web application that allows users to:

- View individual IT assets
- Add assets manually via a frontend form
- Search and filter assets by column (e.g., model, department, status)
- Generate and download reports
- Import assets via CSV
- Authenticate users and restrict access

---

## 🧱 Project Structure

Asset_Tag_Database_2.0/ 
├── backend/ 
│ └── sql/ 
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
│ │ │ └── (filter components coming soon) 
│ │ ├── hooks/ 
│ │ │ └── useAssets.js │ │ ├── utils/ 
│ │ │ └── validation.js 
│ │ ├── supabaseClient.js 
│ ├── .env 
│ ├── package.json 
│ └── vite.config.js

---

## ✅ Current Progress

### 🔧 Backend (Supabase)
- `assets` table created with full schema
- Row-level security enabled
- Public read access temporarily allowed
- Seed data inserted for testing
- Utility scripts for row counts and resets

### 💻 Frontend (React + Vite)
- Supabase client configured
- Asset data fetched and displayed in a table
- Form built to add new assets
- Validation and error handling implemented
- App renders successfully in browser
- Preparing to implement column-based filtering

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


Next Steps
✅ Connect frontend to Supabase
✅ Display asset data in a table
✅ Complete form to add new assets
✅ Add form validation and error handling
🔲 Implement column-based filtering (starting with status)
🔲 Add CSV import support
🔲 Add edit/update and delete functionality
🔲 Add authentication and secure access
🔲 Deploy MVP and test full workflow
📝 Notes
This project is being developed as a learning tool to understand full-stack development, database design, and frontend/backend integration.
Supabase is used to simplify backend setup while maintaining SQL control.
React is used to build a responsive, modern frontend with real-time data interaction.
CSV headers must match the table columns exactly for import.
The frontend is built using React with Vite for fast development and hot module reloading.

---