-- These policies apply to users who are logged in (Supabase will assign them the authenticated role). All authenticated users can perform CRUD opps.

-- Enable Row-Level Security on the assets table
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read assets
CREATE POLICY "Allow authenticated read"
    ON assets
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow all authenticated users to insert assets
CREATE POLICY "Allow authenticated insert"
    ON assets 
    FOR INSERT
    TO authenticated 
    WITH CHECK (true); 

-- Policy: Allow all authenticated users to update assets
CREATE POLICY "Allow authenticated update"
    ON assets
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

    -- Policy: Allow all authenticated users to delete assets
CREATE POLICY " Allow authenticated delete"
    ON assets
    FOR DELETE 
    TO authenticated
    USING (true);

--USING (true): This is the condition — in this case, it always returns true, so all authenticated users can read all rows.
 -- Later, you could change USING (true) to something like USING (department = current_setting('my.department')) to restrict access by department.