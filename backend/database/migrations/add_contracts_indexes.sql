-- ================================================
-- PERFORMANCE OPTIMIZATION: Add indexes to contracts table
-- ================================================
-- Purpose: Speed up contract queries by 10-100x
-- Date: 2025-11-19
-- ================================================

-- Index for developer queries (most important)
-- Used in: GET /developer-collaboration/:developerId
CREATE INDEX IF NOT EXISTS idx_contracts_developer_id
ON contracts(developer_id);

-- Index for entrepreneur queries
-- Used in: GET /entrepreneur-collaboration/:entrepreneurId
CREATE INDEX IF NOT EXISTS idx_contracts_entrepreneur_id
ON contracts(entrepreneur_id);

-- Composite index for filtering unsigned contracts (Contracts tab)
-- Used in: Developer Dashboard Contracts tab filtering
CREATE INDEX IF NOT EXISTS idx_contracts_developer_unsigned
ON contracts(developer_id, signed_by_developer, status);

-- Composite index for filtering signed contracts (Collaborations tab)
-- Used in: Developer Dashboard Collaborations tab filtering
CREATE INDEX IF NOT EXISTS idx_contracts_developer_signed
ON contracts(developer_id, signed_by_developer, signed_by_entrepreneur, status);

-- Index for proposal_id lookups
-- Used in: Contract creation and notification queries
CREATE INDEX IF NOT EXISTS idx_contracts_proposal_id
ON contracts(proposal_id);

-- Index for status-based queries
-- Used in: Filtering contracts by status
CREATE INDEX IF NOT EXISTS idx_contracts_status
ON contracts(status);

-- Index for created_at sorting
-- Used in: ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_contracts_created_at
ON contracts(created_at DESC);

-- Composite index for entrepreneur's pending contracts
-- Used in: Entrepreneur checking which contracts need their signature
CREATE INDEX IF NOT EXISTS idx_contracts_entrepreneur_pending
ON contracts(entrepreneur_id, signed_by_entrepreneur, status);

-- ================================================
-- VERIFICATION QUERY
-- ================================================
-- Run this to verify indexes were created:
-- SHOW INDEXES FROM contracts;
--
-- Expected improvements:
-- - Developer dashboard Contracts tab: 10-15 seconds → 0.5-1 second
-- - Developer dashboard Collaborations tab: 5-10 seconds → 0.3-0.5 seconds
-- - Contract queries by developer_id: O(n) → O(log n)
-- ================================================
