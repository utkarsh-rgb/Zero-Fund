# Zero-Fund Platform - Quick Setup Guide

## 🚀 Getting Started with Workflow Improvements

This guide will help you set up the improved Zero-Fund platform with all the latest features.

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- AWS Account (for S3 file storage)
- SMTP Email Account (Gmail recommended)
- Git

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Database Setup

```bash
# Connect to MySQL
mysql -u your_username -p

# Create database (if not exists)
CREATE DATABASE IF NOT EXISTS zero_fund;

# Exit MySQL
exit

# Run migrations
mysql -u your_username -p zero_fund < backend/database/migrations/workflow_improvements.sql
```

### Step 2: Environment Configuration

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
nano .env  # or use your preferred editor
```

**Minimum Required Variables:**
```env
# Database
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=zero_fund

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 3: Gmail SMTP Setup (2 minutes)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create password for "Mail"
5. Copy the 16-character password to `SMTP_PASSWORD` in `.env`

### Step 4: Install & Run

```bash
# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

You should see:
```
🚀 Server running on port 5000
```

---

## 🎯 What's New?

### 1. Entrepreneur Notifications

Entrepreneurs now receive notifications for:
- ✅ New proposal submissions
- ✅ Contract signings by developers
- ✅ Proposal withdrawals

**Test it:**
1. Developer submits a proposal
2. Check entrepreneur's notifications

### 2. Proposal Withdrawal

Developers can now withdraw proposals before they're approved.

**Test it:**
```bash
curl -X POST http://localhost:5000/proposal/:proposalId/withdraw \
  -H "Content-Type: application/json" \
  -d '{"proposalId": 1, "developerId": 1}'
```

### 3. Enhanced Contract Workflow

**New statuses:**
- `draft` - Initial creation
- `pending_entrepreneur_signature` - Developer signed
- `signed` - Both parties signed
- `rejected` - Entrepreneur rejected with reason

**Test the flow:**
1. Developer signs contract → Entrepreneur gets notification
2. Entrepreneur accepts → Developer gets notification
3. Collaboration becomes active

### 4. Email Notifications

Users receive professional emails for:
- 📧 Welcome on signup
- 📧 Proposal submissions
- 📧 Proposal status updates
- 📧 Contract signatures

---

## 📊 Database Tables Added

Run this to verify tables were created:

```sql
SHOW TABLES LIKE '%notification%';
SHOW TABLES LIKE 'activity_log';
```

You should see:
- `entrepreneur_notifications`
- `notifications` (existing, enhanced)
- `notification_preferences`
- `activity_log`

---

## 🧪 Testing the Workflow

### Test 1: Complete Proposal Flow

```bash
# 1. Developer submits proposal
POST /submit-proposal
{
  "ideaId": 1,
  "developerId": 1,
  "scope": "Build MVP",
  "timeline": "3 months",
  "equityRequested": 10,
  "milestones": [...]
}

# 2. Check entrepreneur notifications
GET /entrepreneur-notifications/1

# 3. Entrepreneur accepts
POST /proposal/1/status
{
  "action": "accept",
  "entrepreneurId": 1
}

# 4. Check developer notifications
GET /notifications/1
```

### Test 2: Contract Signing

```bash
# 1. Developer signs
POST /contracts/developer-sign
{
  "contractId": 1,
  "developerId": 1
}

# 2. Check pending contracts for entrepreneur
GET /contracts/pending/1

# 3. Entrepreneur accepts
POST /contracts/entrepreneur-accept
{
  "contractId": 1,
  "entrepreneurId": 1
}
```

### Test 3: Email Notifications

Check your inbox for:
- Welcome email after signup
- Proposal notification email
- Contract signature email

**If emails aren't arriving:**
1. Check `.env` SMTP settings
2. Verify app password
3. Check spam folder
4. Review server logs for errors

---

## 🔧 Troubleshooting

### Problem: Database errors

**Solution:**
```bash
# Check if migration ran
mysql -u username -p zero_fund

DESCRIBE entrepreneur_notifications;
DESCRIBE activity_log;

# If tables don't exist, re-run migration
mysql -u username -p zero_fund < backend/database/migrations/workflow_improvements.sql
```

### Problem: Emails not sending

**Solution:**
1. Test SMTP connection:
```javascript
// In backend, run this test
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.verify(function(error, success) {
  if (error) console.log(error);
  else console.log('Server is ready to send emails');
});
```

2. Check firewall allows port 587
3. Verify Gmail app password (not regular password)

### Problem: Notifications not showing

**Solution:**
```bash
# Check if table exists
mysql -u username -p zero_fund -e "SELECT COUNT(*) FROM entrepreneur_notifications;"

# Check if route is registered
curl http://localhost:5000/entrepreneur-notifications/1

# Check server logs for errors
```

---

## 📝 API Documentation

### New Endpoints

#### Entrepreneur Notifications
```
GET    /entrepreneur-notifications/:entrepreneurId
PATCH  /entrepreneur-notifications/:id/read
PATCH  /entrepreneur-notifications/read-all/:entrepreneurId
DELETE /entrepreneur-notifications/:id
```

#### Proposals
```
POST   /proposal/:proposalId/withdraw
```

#### Contracts
```
POST   /contracts/developer-sign
POST   /contracts/entrepreneur-accept
POST   /contracts/entrepreneur-reject
GET    /contracts/pending/:entrepreneurId
GET    /contracts/developer/:developerId
```

---

## 🚢 Production Deployment

### Environment Variables for Production

Update `.env`:
```env
NODE_ENV=production
FRONTEND_URL=https://your-production-domain.com
DB_HOST=your-rds-endpoint.amazonaws.com
SMTP_HOST=smtp.sendgrid.net  # Or your production email service
```

### Production Checklist

- [ ] Run database migration on production DB
- [ ] Update all `.env` variables
- [ ] Configure production SMTP
- [ ] Set up SSL certificates
- [ ] Enable CORS for production domain
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Test all critical workflows

---

## 📚 Additional Resources

- **Full Documentation:** [WORKFLOW_IMPROVEMENTS.md](./WORKFLOW_IMPROVEMENTS.md)
- **Environment Variables:** [backend/.env.example](./backend/.env.example)
- **Database Migration:** [backend/database/migrations/workflow_improvements.sql](./backend/database/migrations/workflow_improvements.sql)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs:**
   ```bash
   # Backend logs
   npm start
   # Look for error messages
   ```

2. **Verify database:**
   ```bash
   mysql -u username -p zero_fund
   SHOW TABLES;
   ```

3. **Test endpoints:**
   ```bash
   # Use curl or Postman to test
   curl http://localhost:5000/health
   ```

4. **Review documentation:**
   - Check [WORKFLOW_IMPROVEMENTS.md](./WORKFLOW_IMPROVEMENTS.md)
   - Review inline code comments

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Server starts without errors
- [ ] Database tables exist
- [ ] Can submit a proposal
- [ ] Entrepreneur receives notification
- [ ] Email notification sent
- [ ] Can withdraw proposal
- [ ] Contract signing works
- [ ] Activity logs are created

---

## 🎉 Success!

If all tests pass, your Zero-Fund platform is ready with:
- ✨ Enhanced user experience
- 🔔 Complete notification system
- 📧 Email notifications
- 🔒 Better security
- 📊 Activity logging
- 🚀 Production-ready architecture

**Next Steps:**
1. Customize email templates in `backend/services/emailService.js`
2. Configure notification preferences UI
3. Add frontend components for new features
4. Monitor activity logs for insights

---

**Happy Building! 🚀**

*Last Updated: November 2024*
