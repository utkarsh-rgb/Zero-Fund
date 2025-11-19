-- Migration: Add indexes for better query performance
-- Purpose: Optimize database queries for idea fetching and related operations
-- Date: 2025-11-18

-- ============================================
-- INDEXES FOR entrepreneur_idea TABLE
-- ============================================

-- Index on entrepreneur_id for faster queries when fetching ideas by entrepreneur
CREATE INDEX IF NOT EXISTS idx_entrepreneur_idea_entrepreneur_id
ON entrepreneur_idea(entrepreneur_id);

-- Index on status for faster filtering of active/closed ideas
CREATE INDEX IF NOT EXISTS idx_entrepreneur_idea_status
ON entrepreneur_idea(status);

-- Index on visibility for faster filtering by visibility type
CREATE INDEX IF NOT EXISTS idx_entrepreneur_idea_visibility
ON entrepreneur_idea(visibility);

-- Index on created_at for faster date-based sorting and filtering
CREATE INDEX IF NOT EXISTS idx_entrepreneur_idea_created_at
ON entrepreneur_idea(created_at DESC);

-- Composite index for common query pattern: filtering active ideas by visibility
CREATE INDEX IF NOT EXISTS idx_entrepreneur_idea_status_visibility
ON entrepreneur_idea(status, visibility);

-- ============================================
-- INDEXES FOR proposals TABLE
-- ============================================

-- Index on idea_id for faster proposal lookups by idea
CREATE INDEX IF NOT EXISTS idx_proposals_idea_id
ON proposals(idea_id);

-- Index on developer_id for faster queries when fetching developer's proposals
CREATE INDEX IF NOT EXISTS idx_proposals_developer_id
ON proposals(developer_id);

-- Index on status for faster filtering by proposal status
CREATE INDEX IF NOT EXISTS idx_proposals_status
ON proposals(status);

-- Composite index for common query: finding proposals by idea and status
CREATE INDEX IF NOT EXISTS idx_proposals_idea_status
ON proposals(idea_id, status);

-- Index on created_at for sorting proposals by date
CREATE INDEX IF NOT EXISTS idx_proposals_created_at
ON proposals(created_at DESC);

-- ============================================
-- INDEXES FOR bookmarks TABLE
-- ============================================

-- Index on developer_id for faster bookmark lookups by developer
CREATE INDEX IF NOT EXISTS idx_bookmarks_developer_id
ON bookmarks(developer_id);

-- Index on idea_id for faster bookmark lookups by idea
CREATE INDEX IF NOT EXISTS idx_bookmarks_idea_id
ON bookmarks(idea_id);

-- Composite unique index to prevent duplicate bookmarks and speed up lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookmarks_developer_idea
ON bookmarks(developer_id, idea_id);

-- ============================================
-- INDEXES FOR milestones TABLE
-- ============================================

-- Index on proposal_id for faster milestone queries by proposal
CREATE INDEX IF NOT EXISTS idx_milestones_proposal_id
ON milestones(proposal_id);

-- Index on completed status for filtering completed/incomplete milestones
CREATE INDEX IF NOT EXISTS idx_milestones_completed
ON milestones(completed);

-- ============================================
-- INDEXES FOR notifications TABLE
-- ============================================

-- Index on developer_id for faster notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_developer_id
ON notifications(developer_id);

-- Index on is_read for filtering read/unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_is_read
ON notifications(is_read);

-- Composite index for common query: unread notifications for a developer
CREATE INDEX IF NOT EXISTS idx_notifications_developer_unread
ON notifications(developer_id, is_read);

-- Index on created_at for sorting notifications by date
CREATE INDEX IF NOT EXISTS idx_notifications_created_at
ON notifications(created_at DESC);

-- ============================================
-- PERFORMANCE NOTES
-- ============================================

-- These indexes will significantly improve:
-- 1. Fetching ideas by ID (already fast due to primary key)
-- 2. Filtering ideas by entrepreneur, status, visibility
-- 3. Developer dashboard queries (active ideas with bookmark status)
-- 4. Proposal submission and management
-- 5. Bookmark operations (check, add, remove)
-- 6. Notification queries for developers
-- 7. Date-based sorting across all tables

-- Trade-offs:
-- - Slightly slower INSERT/UPDATE/DELETE operations
-- - Increased storage space (minimal)
-- - Much faster SELECT queries (significant improvement)

-- Recommendation: Run ANALYZE TABLE after applying these indexes
-- to update query optimizer statistics
