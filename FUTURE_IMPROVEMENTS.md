# Improvements for Future Iterations

## 🔎 Filtering and Search Functionality/Design

- PropTypes or TypeScript:	
    - Adds type safety and documentation
- Unit tests for filters:	
    - Ensures filtering logic works as expected
- Styling for FiltersBar:	
    - Improves user experience
- Clear All Filters button:	
    - Adds usability
- Debounced text input:	
    - Prevents filtering on every keystroke (performance)
- Move the "Filtered Logic" into its own separate file or custom hook (ask yourself, "which one is most efficient and enterprise standard?").

## 📝 CSV File Uploading

- Add preview table before submitting CSV data.
- Add error handling for malformed rows.
- Add support for uploading parsed data to the backend (SQL Server).
- Replace PapaParse with custom parser for enterprise alignment (already implemented).

## 🎨 Design
- All buttons should have one class that applies styling elements universally.

## MS SQL Server Migration (Version 2.0)
- Swap my entire database from Supabase to MSSQL without changing my UI code