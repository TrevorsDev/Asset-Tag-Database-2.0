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
- Add a "Drag and Drop" listener and a progress bar.

## Editing 
- Add inline/input errors when a user attempts to send an empty field in edit modal.
- Only allow the "X" or "Cancel" button to close the modal if the form is "dirty" (has changes), or simply disable the "click-to-close" on the overlay to prevent data loss when accidentally clicked on.
- Back-End (SQL): In a "High-Security" enterprise app, I should add a trigger in SQL to trim strings automatically. But for V1, handling it in the React form is the industry standard.
## 🎨 Design
- All buttons should have one class that applies styling elements universally.

## MS SQL Server Migration (Version 2.0)
- Swap my entire database from Supabase to MSSQL without changing my UI code