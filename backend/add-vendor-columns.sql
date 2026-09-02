ALTER TABLE vendors ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;
UPDATE vendors SET status = 'approved' WHERE is_approved = true;
UPDATE vendors SET status = 'pending' WHERE is_approved = false;