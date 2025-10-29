-- Creating asset tag table with key information for each item using SQL that works/is transferrable to both PostgreSQL and Microsoft SQL Server 

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Assets table

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

-- Unique constraints. Makes sure theres never two of the same asset tags or serial numbers in those columns
ALTER TABLE assets ADD CONSTRAINT unique_asset_tag UNIQUE (asset_tag);
ALTER TABL assets ADD CONSTRAINT unique_serial_number UNIQUE (serial_number);

-- indexes
CREATE INDEX idx_asset_tag ON assets(asset_tag);
CREATE INDEX idx_model ON assets(model);
CREATE INDEX idx_department ON assets(department);
CREATE INDEX idx_status ON assets(status);