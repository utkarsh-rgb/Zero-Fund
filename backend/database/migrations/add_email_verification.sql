-- Add email verification columns to developers table
ALTER TABLE developers
ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS token_expiry DATETIME DEFAULT NULL;

-- Add email verification columns to entrepreneur table
ALTER TABLE entrepreneur
ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS token_expiry DATETIME DEFAULT NULL;

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_developers_verification_token ON developers(verification_token);
CREATE INDEX IF NOT EXISTS idx_entrepreneur_verification_token ON entrepreneur(verification_token);
