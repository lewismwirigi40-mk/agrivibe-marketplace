ALTER TABLE guide_purchases ADD COLUMN IF NOT EXISTS escrow_status VARCHAR(20) DEFAULT 'held';
ALTER TABLE guide_purchases ADD COLUMN IF NOT EXISTS escrow_released_at TIMESTAMP;
ALTER TABLE guide_purchases ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2);
ALTER TABLE guide_purchases ADD COLUMN IF NOT EXISTS vendor_id UUID;
ALTER TABLE guide_purchases ADD COLUMN IF NOT EXISTS vendor_amount DECIMAL(10,2);