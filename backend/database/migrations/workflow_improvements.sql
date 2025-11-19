-- ============================================
-- ZERO-FUND WORKFLOW IMPROVEMENTS MIGRATION
-- ============================================
-- This migration adds improvements for better workflow management

-- 1. Create entrepreneur notifications table
CREATE TABLE IF NOT EXISTS entrepreneur_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entrepreneur_id INT NOT NULL,
  proposal_id INT DEFAULT NULL,
  contract_id INT DEFAULT NULL,
  message TEXT NOT NULL,
  type ENUM('proposal_received', 'contract_signed', 'milestone_completed', 'general') DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entrepreneur_id) REFERENCES entrepreneur(id) ON DELETE CASCADE,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  INDEX idx_entrepreneur_notifications (entrepreneur_id, is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Add indexes to existing tables for better performance
ALTER TABLE notifications
  ADD INDEX IF NOT EXISTS idx_developer_read (developer_id, created_at),
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE AFTER message,
  ADD COLUMN IF NOT EXISTS type ENUM('proposal_status', 'contract_status', 'message', 'general') DEFAULT 'general' AFTER is_read;

-- 3. Add withdrawal status and timestamps to proposals
ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS withdrawn BOOLEAN DEFAULT FALSE AFTER status,
  ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMP NULL AFTER withdrawn,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
  ADD INDEX IF NOT EXISTS idx_idea_status (idea_id, status, withdrawn);

-- 4. Add timestamps and rejection reason to contracts
ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS signed_by_developer_at TIMESTAMP NULL AFTER signed_by_developer,
  ADD COLUMN IF NOT EXISTS signed_by_entrepreneur_at TIMESTAMP NULL AFTER signed_by_entrepreneur,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL AFTER status,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
  ADD INDEX IF NOT EXISTS idx_contract_status (status, signed_by_developer, signed_by_entrepreneur);

-- 5. Add status tracking to entrepreneur_idea
ALTER TABLE entrepreneur_idea
  ADD COLUMN IF NOT EXISTS idea_status ENUM('active', 'closed', 'in_progress', 'completed') DEFAULT 'active' AFTER status,
  ADD COLUMN IF NOT EXISTS proposal_count INT DEFAULT 0 AFTER idea_status,
  ADD INDEX IF NOT EXISTS idx_entrepreneur_status (entrepreneur_id, idea_status, created_at);

-- 6. Create activity log table for audit trail
CREATE TABLE IF NOT EXISTS activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_type ENUM('developer', 'entrepreneur') NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  description TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_activity (user_id, user_type, created_at),
  INDEX idx_entity_activity (entity_type, entity_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Add email notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_type ENUM('developer', 'entrepreneur') NOT NULL,
  email_on_proposal BOOLEAN DEFAULT TRUE,
  email_on_contract BOOLEAN DEFAULT TRUE,
  email_on_milestone BOOLEAN DEFAULT TRUE,
  email_on_message BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_prefs (user_id, user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Update existing data - mark old notifications as read if created more than 30 days ago
UPDATE notifications
SET is_read = TRUE
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_read = FALSE;

-- Migration complete
SELECT 'Workflow improvements migration completed successfully!' AS status;
