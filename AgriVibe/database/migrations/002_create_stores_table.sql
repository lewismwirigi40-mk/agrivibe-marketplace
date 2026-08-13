-- ============================================
-- AGRIVIBE - STORES TABLE
-- Migration: 002_create_stores_table
-- ============================================

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL,
    store_slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stores_vendor_id ON stores(vendor_id);
CREATE INDEX idx_stores_slug ON stores(store_slug);
CREATE INDEX idx_stores_is_approved ON stores(is_approved);
