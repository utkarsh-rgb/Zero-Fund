# Zero Fund - Production Deployment Guide

This guide will help you deploy the Zero Fund application to production.

## Prerequisites

- Node.js (v16 or higher)
- MySQL Database
- AWS S3 Bucket (for file storage)
- Google Gemini API Key
- Domain names for frontend and backend

## Backend Setup

### 1. Environment Variables

Copy the example environment file and configure it with your production values:

```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your production values:

```env
# Server Configuration
PORT=5000

# CORS Configuration
# Add your production frontend domain(s)
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Database Configuration
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=skill_invest
DB_PORT=3306

# JWT Secret Key (Generate a secure random string)
# You can generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_secure_jwt_secret_key_here

# Encryption Key for Messages
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your_32_byte_hex_encryption_key_here

# AWS S3 Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
S3_BUCKET=your_s3_bucket_name

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# SMTP Configuration (for password reset emails)
SMTP_USER=your_smtp_email@gmail.com
SMTP_PASS=your_smtp_password_or_app_password
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Make sure your MySQL database is set up and the schema is created. Run any necessary migrations.

### 4. Start the Server

```bash
npm start
```

For production with process manager (recommended):

```bash
npm install -g pm2
pm2 start server.js --name zero-fund-backend
pm2 save
pm2 startup
```

## Frontend Setup

### 1. Environment Variables

Copy the example environment file:

```bash
cd frontend
cp .env.example .env
```

Edit `.env` file with your production backend URL:

```env
# For production, set this to your actual backend API URL
VITE_API_URL=https://your-backend-domain.com

# Alternative: Use VITE_PROD_API_URL (will be used as fallback in production builds)
VITE_PROD_API_URL=https://your-backend-domain.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build for Production

```bash
npm run build
```

This will create optimized production files in the `dist/spa` directory.

### 4. Deploy

You have several options for deploying the frontend:

#### Option A: Serve from Backend (Integrated)

The backend is already configured to serve the frontend from `dist/spa`. Just make sure the frontend is built and the files are in the correct location.

#### Option B: Deploy to CDN/Static Hosting

1. Upload the contents of `dist/spa` to your hosting service (Netlify, Vercel, AWS S3, etc.)
2. Configure your hosting service to:
   - Serve `index.html` for all routes (SPA routing)
   - Set the environment variable `VITE_API_URL` to your backend URL

#### Option C: Serve with Nginx

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;

    root /path/to/Zero-Fund/frontend/dist/spa;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment-Specific Configuration

### Development

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000
```

Backend `.env`:
```env
PORT=5000
CORS_ORIGINS=http://localhost:8080,http://localhost:3000
```

### Production

Frontend `.env`:
```env
VITE_API_URL=https://api.zerofundventure.com
```

Backend `.env`:
```env
PORT=5000
CORS_ORIGINS=https://zerofundventure.com,https://www.zerofundventure.com
```

## Security Checklist

- [ ] Generate strong, unique values for `JWT_SECRET` and `ENCRYPTION_KEY`
- [ ] Use HTTPS for both frontend and backend in production
- [ ] Secure your database with strong passwords and firewall rules
- [ ] Rotate AWS credentials regularly
- [ ] Keep all dependencies up to date
- [ ] Enable CORS only for your actual frontend domain(s)
- [ ] Use environment variables for all sensitive data (never commit `.env` files)

## Monitoring

After deployment, monitor:

- Server logs (use `pm2 logs` if using PM2)
- Database connection status
- API response times
- Error rates
- AWS S3 usage

## Troubleshooting

### CORS Errors

Make sure `CORS_ORIGINS` in backend `.env` includes your frontend domain.

### API Connection Failed

Verify that `VITE_API_URL` in frontend `.env` points to the correct backend URL.

### Database Connection Errors

Check that all database credentials in backend `.env` are correct and the database is accessible from your server.

## Support

For issues or questions, please open an issue on the GitHub repository.
