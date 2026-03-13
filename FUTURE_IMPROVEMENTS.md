# Improvements for Future Iterations

## App Architecture 

### Switching from props to React Context

 - Should be done as the app grows in size
 
#### Props

- Simple
- Predictable
- Easy to debug
- Perfect for small/medium apps
- Zero magic

#### React Context

- Used in enterprise apps
- Avoids passing props through many layers
- Lets multiple components share the same state
- Cleaner architecture for large systems

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
- Empty States: When a user searches for an asset that doesnt exist, a "No asset found matching your search" message should appear. 

## 📝 CSV File Uploading

- Add preview table before submitting CSV data.
- Add error handling for malformed rows.
- Add support for uploading parsed data to the backend (SQL Server).
- Replace PapaParse with custom parser for enterprise alignment (already implemented).
- Add a "Drag and Drop" listener and a progress bar.
- Auto-Column Detection. React automatically queries the SQL information_schema to get a list of column names, stores that in a React state, and compares the uploading CSV against it.

# CSV File Exporting for Financial Team
- Adding a "Download Report" button
- This functionality should align with the specific needs of the department and finance teams 
- **Granular Data Validation:** Implement row-level error reporting to identify specific line numbers and Serial Numbers causing database conflicts, allowing users to fix large CSV files.

## Editing 
- Add inline/input errors when a user attempts to send an empty field in edit modal.
- Only allow the "X" or "Cancel" button to close the modal if the form is "dirty" (has changes), or simply disable the "click-to-close" on the overlay to prevent data loss when accidentally clicked on.
- Back-End (SQL): In a "High-Security" enterprise app, I should add a trigger in SQL to trim strings automatically. But for V1, handling it in the React form is the industry standard.
- When saving an edit a green "Asset Updated Successfully" pop-up in the corner (a "Toast") should appear.

## 🎨 Design
- All buttons should have one class that applies styling elements universally.

## MS SQL Server Migration (Version 2.0)
- Swap my entire database from Supabase to MSSQL without changing my UI code