-- Creating asset tag table with key information for each item using SQL that works/is transferrable to both PostgreSQL and Microsoft SQL Server 
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_tag VARCHAR(255),
  pr VARCHAR(255),
  status VARCHAR(100),
  po VARCHAR(100),
  serial_number VARCHAR(100),
  model VARCHAR(100),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);