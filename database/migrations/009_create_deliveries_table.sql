-- ============================================
-- AGRIVIBE - DELIVERIES TABLE
-- Migration: 009_create_deliveries_table
-- ============================================

CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    pickup_lat DECIMAL(10,8),
    pickup_lng DECIMAL(11,8),
    delivery_lat DECIMAL(10,8),
    delivery_lng DECIMAL(11,8),
    status VARCHAR(50) NOT NULL DEFAULT 'assigned',
    distance DECIMAL(10,2),
    delivery_fee DECIMAL(10,2),
    estimated_time INTEGER,
    actual_time INTEGER,
    pickup_time TIMESTAMP,
    delivery_time TIMESTAMP,
    completed_at TIMESTAMP,
    proof_image VARCHAR(500),
    signature VARCHAR(255),
    driver_notes TEXT,
    customer_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_driver_id ON deliveries(driver_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
