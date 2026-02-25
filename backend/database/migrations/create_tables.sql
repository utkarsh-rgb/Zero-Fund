-- ======================================================
-- Skill Invest - Complete Database Schema
-- MySQL / Amazon RDS
-- ======================================================

-- 1. DEVELOPERS TABLE
CREATE TABLE IF NOT EXISTS `developers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `bio` TEXT DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `profile_pic` VARCHAR(500) DEFAULT NULL,
  `profile_pic_type` VARCHAR(100) DEFAULT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `verification_token` VARCHAR(255) DEFAULT NULL,
  `token_expiry` DATETIME DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expiry` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_developers_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. ENTREPRENEUR TABLE
CREATE TABLE IF NOT EXISTS `entrepreneur` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `headline` VARCHAR(255) DEFAULT NULL,
  `industry` VARCHAR(255) DEFAULT NULL,
  `website` VARCHAR(500) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `vision` TEXT DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `profile_pic` VARCHAR(500) DEFAULT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `verification_token` VARCHAR(255) DEFAULT NULL,
  `token_expiry` DATETIME DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expiry` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_entrepreneur_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. ENTREPRENEUR IDEAS TABLE
CREATE TABLE IF NOT EXISTS `entrepreneur_idea` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `entrepreneur_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `overview` TEXT NOT NULL,
  `stage` VARCHAR(50) DEFAULT NULL COMMENT 'Values: Idea, MVP, Beta',
  `equity_offering` VARCHAR(100) DEFAULT NULL,
  `visibility` VARCHAR(50) DEFAULT 'Public' COMMENT 'Values: Public, NDA Required, Invite Only',
  `timeline` VARCHAR(255) DEFAULT NULL,
  `budget` DECIMAL(15, 2) DEFAULT NULL,
  `additional_requirements` TEXT DEFAULT NULL,
  `required_skills` JSON DEFAULT NULL,
  `attachments` JSON DEFAULT NULL,
  `nda_accepted` TINYINT(1) NOT NULL DEFAULT 0,
  `status` INT NOT NULL DEFAULT 0 COMMENT '0 = active, 1 = closed',
  `proposal_count` INT NOT NULL DEFAULT 0,
  `flag` VARCHAR(100) DEFAULT NULL COMMENT 'Level indicator',
  `views` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entrepreneur_idea_entrepreneur_id` (`entrepreneur_id`),
  KEY `idx_entrepreneur_idea_status` (`status`),
  KEY `idx_entrepreneur_idea_visibility` (`visibility`),
  KEY `idx_entrepreneur_idea_created_at` (`created_at` DESC),
  KEY `idx_entrepreneur_idea_status_visibility` (`status`, `visibility`),
  CONSTRAINT `fk_idea_entrepreneur` FOREIGN KEY (`entrepreneur_id`) REFERENCES `entrepreneur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS `proposals` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idea_id` INT NOT NULL,
  `developer_id` INT NOT NULL,
  `scope` TEXT NOT NULL,
  `timeline` VARCHAR(255) DEFAULT NULL,
  `equity_requested` VARCHAR(100) DEFAULT NULL,
  `additional_notes` TEXT DEFAULT NULL,
  `contract_status` VARCHAR(50) NOT NULL DEFAULT 'not_generated' COMMENT 'Values: not_generated, generated',
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending' COMMENT 'Values: Pending, Approved, Rejected, Withdrawn, Under Review, Accepted',
  `withdrawn` TINYINT(1) NOT NULL DEFAULT 0,
  `withdrawn_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_proposals_idea_id` (`idea_id`),
  KEY `idx_proposals_developer_id` (`developer_id`),
  KEY `idx_proposals_status` (`status`),
  KEY `idx_proposals_idea_status` (`idea_id`, `status`),
  KEY `idx_proposals_created_at` (`created_at` DESC),
  CONSTRAINT `fk_proposal_idea` FOREIGN KEY (`idea_id`) REFERENCES `entrepreneur_idea` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_proposal_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. MILESTONES TABLE
CREATE TABLE IF NOT EXISTS `milestones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `proposal_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `duration` VARCHAR(255) DEFAULT '',
  `completed` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_milestones_proposal_id` (`proposal_id`),
  KEY `idx_milestones_completed` (`completed`),
  CONSTRAINT `fk_milestone_proposal` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. CONTRACTS TABLE
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `proposal_id` INT NOT NULL,
  `entrepreneur_id` INT NOT NULL,
  `entrepreneur_name` VARCHAR(255) DEFAULT NULL,
  `entrepreneur_email` VARCHAR(255) DEFAULT NULL,
  `entrepreneur_company` VARCHAR(255) DEFAULT NULL,
  `entrepreneur_address` VARCHAR(500) DEFAULT NULL,
  `developer_id` INT NOT NULL,
  `developer_name` VARCHAR(255) DEFAULT NULL,
  `developer_email` VARCHAR(255) DEFAULT NULL,
  `developer_address` VARCHAR(500) DEFAULT NULL,
  `developer_skills` JSON DEFAULT NULL,
  `project_title` VARCHAR(255) NOT NULL,
  `project_description` TEXT DEFAULT NULL,
  `scope` TEXT DEFAULT NULL,
  `timeline` VARCHAR(255) DEFAULT NULL,
  `milestones` JSON DEFAULT NULL,
  `equity_percentage` VARCHAR(100) DEFAULT NULL,
  `ip_ownership` TEXT DEFAULT NULL,
  `confidentiality` TEXT DEFAULT NULL,
  `termination_clause` TEXT DEFAULT NULL,
  `dispute_resolution` TEXT DEFAULT NULL,
  `governing_law` VARCHAR(255) DEFAULT NULL,
  `additional_clauses` JSON DEFAULT NULL,
  `revisions` TEXT DEFAULT NULL,
  `support_terms` TEXT DEFAULT NULL,
  `signed_by_developer` TINYINT(1) NOT NULL DEFAULT 0,
  `signed_by_developer_at` DATETIME DEFAULT NULL,
  `signed_by_entrepreneur` TINYINT(1) NOT NULL DEFAULT 0,
  `signed_by_entrepreneur_at` DATETIME DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'draft' COMMENT 'Values: draft, pending_signature, pending_entrepreneur_signature, signed, rejected, terminated',
  `rejection_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contracts_proposal_id` (`proposal_id`),
  KEY `idx_contracts_entrepreneur_id` (`entrepreneur_id`),
  KEY `idx_contracts_developer_id` (`developer_id`),
  KEY `idx_contracts_status` (`status`),
  CONSTRAINT `fk_contract_proposal` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_contract_entrepreneur` FOREIGN KEY (`entrepreneur_id`) REFERENCES `entrepreneur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_contract_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS `bookmarks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `developer_id` INT NOT NULL,
  `idea_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_bookmarks_developer_idea` (`developer_id`, `idea_id`),
  KEY `idx_bookmarks_developer_id` (`developer_id`),
  KEY `idx_bookmarks_idea_id` (`idea_id`),
  CONSTRAINT `fk_bookmark_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookmark_idea` FOREIGN KEY (`idea_id`) REFERENCES `entrepreneur_idea` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 8. NOTIFICATIONS TABLE (Developer Notifications)
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `developer_id` INT NOT NULL,
  `proposal_id` INT DEFAULT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL COMMENT 'Values: proposal_status, contract_created, contract_status',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_developer_id` (`developer_id`),
  KEY `idx_notifications_is_read` (`is_read`),
  KEY `idx_notifications_developer_unread` (`developer_id`, `is_read`),
  KEY `idx_notifications_created_at` (`created_at` DESC),
  CONSTRAINT `fk_notification_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notification_proposal` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. ENTREPRENEUR NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `entrepreneur_notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `entrepreneur_id` INT NOT NULL,
  `proposal_id` INT DEFAULT NULL,
  `contract_id` INT DEFAULT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL COMMENT 'Values: proposal_received, contract_signed, general',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entrepreneur_notif_entrepreneur_id` (`entrepreneur_id`),
  KEY `idx_entrepreneur_notif_is_read` (`is_read`),
  CONSTRAINT `fk_entrepreneur_notif_entrepreneur` FOREIGN KEY (`entrepreneur_id`) REFERENCES `entrepreneur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_entrepreneur_notif_proposal` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_entrepreneur_notif_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 10. DEVELOPER SKILLS TABLE
CREATE TABLE IF NOT EXISTS `developer_skills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `developer_id` INT NOT NULL,
  `skill` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_developer_skills_developer_id` (`developer_id`),
  CONSTRAINT `fk_skill_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 11. DEVELOPER LINKS TABLE
CREATE TABLE IF NOT EXISTS `developer_links` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `developer_id` INT NOT NULL,
  `platform` VARCHAR(100) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_developer_links_developer_id` (`developer_id`),
  CONSTRAINT `fk_link_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 12. DEVELOPER PROJECTS TABLE
CREATE TABLE IF NOT EXISTS `developer_projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `developer_id` INT NOT NULL,
  `project_name` VARCHAR(255) NOT NULL,
  `project_url` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_developer_projects_developer_id` (`developer_id`),
  CONSTRAINT `fk_project_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 13. ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS `activity_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'Polymorphic FK - developer or entrepreneur ID',
  `user_type` VARCHAR(50) NOT NULL COMMENT 'Values: developer, entrepreneur',
  `action_type` VARCHAR(100) NOT NULL COMMENT 'Values: contract_signed, contract_accepted, contract_rejected, contract_created, proposal_submitted, proposal_withdrawn, proposal_accepted, proposal_rejected',
  `entity_type` VARCHAR(50) NOT NULL COMMENT 'Values: contract, proposal',
  `entity_id` INT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activity_log_user` (`user_id`, `user_type`),
  KEY `idx_activity_log_entity` (`entity_type`, `entity_id`),
  KEY `idx_activity_log_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 14. MESSAGES TABLE (Chat)
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contract_id` INT NOT NULL COMMENT 'Used as chat room ID',
  `sender_id` INT NOT NULL COMMENT 'Polymorphic - developer or entrepreneur ID',
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_messages_contract_id` (`contract_id`),
  KEY `idx_messages_sender_id` (`sender_id`),
  KEY `idx_messages_created_at` (`created_at` ASC),
  CONSTRAINT `fk_message_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 15. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
