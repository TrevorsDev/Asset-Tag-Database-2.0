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