-- ============================================
-- AGRIVIBE - CAMPUSES TABLE
-- Migration: 006_create_campuses_table
-- ============================================

CREATE TABLE IF NOT EXISTS campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    university VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Kenya',
    student_population INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    cover_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campuses_slug ON campuses(slug);
CREATE INDEX idx_campuses_university ON campuses(university);
CREATE INDEX idx_campuses_is_active ON campuses(is_active);
