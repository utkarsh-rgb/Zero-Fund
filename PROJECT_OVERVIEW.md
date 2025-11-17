# Zero-Fund Project Overview

## Project Summary

**Zero-Fund** is a full-stack web platform that connects entrepreneurs with skilled developers for equity-based collaborations. The platform enables entrepreneurs to post project ideas and developers to submit proposals, ultimately facilitating formal contract agreements and project collaboration management.

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MySQL (AWS RDS)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Real-time Communication**: Socket.IO for messaging
- **File Storage**: AWS S3 for file uploads
- **Email**: Smart-mailer for notifications
- **AI Integration**: Google Gemini AI
- **Key Dependencies**:
  - `mysql2` - Database connection pooling
  - `multer` - File upload handling
  - `jsonwebtoken` - Authentication
  - `cors` - Cross-origin resource sharing
  - `dotenv` - Environment configuration

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom animations
- **UI Components**: Radix UI component library
- **State Management**: TanStack React Query
- **Routing**: React Router DOM v6
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Toastify & Sonner
- **PDF Generation**: React-PDF Renderer & jsPDF
- **3D Graphics**: Three.js with React Three Fiber
- **Key Features**:
  - Responsive design
  - Dark mode support (next-themes)
  - Rich UI components (dialogs, dropdowns, tabs, etc.)
  - PDF contract generation

## Core Features

### 1. User Management
- **Dual User Types**:
  - **Developers**: Technical professionals seeking equity-based opportunities
  - **Entrepreneurs**: Idea owners looking for development partners
- **Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Customizable profiles with profile pictures
- **Password Recovery**: Forgot/reset password functionality

### 2. Idea Management (Entrepreneurs)
- **Post Ideas**: Create detailed project proposals with:
  - Title, overview, and stage
  - Equity offering percentage
  - Timeline and visibility settings
  - File attachments (stored in AWS S3)
  - Skills required
- **Edit Ideas**: Modify existing project ideas
- **Visibility Control**: Public or private idea listings

### 3. Proposal System (Developers)
- **Browse Ideas**: Explore available opportunities
- **Submit Proposals**:
  - Define project scope
  - Set timeline and equity requests
  - Add milestones
  - Include additional notes
- **Proposal Tracking**: View submitted proposals and their status

### 4. Contract Builder
- **Digital Contract Creation**:
  - Project details and scope
  - Timeline and equity distribution
  - IP ownership clauses
  - Confidentiality agreements
  - Termination conditions
  - Dispute resolution terms
  - Governing law specifications
  - Custom additional clauses
- **Dual Signature System**: Both parties must sign
- **PDF Generation**: Export contracts as PDF documents

### 5. Collaboration Management
- **Active Collaborations**: Track ongoing projects
- **Contribution Tracking**: Monitor work progress
- **Milestone Management**: Define and track project milestones
- **Review System**: Evaluate contributions

### 6. Communication
- **Real-time Messaging**: Socket.IO-powered chat system
- **Developer-Entrepreneur Chat**: Direct communication channels
- **Collaboration Chat**: Project-specific discussions
- **Message Notifications**: Real-time message alerts

### 7. Notifications & Bookmarks
- **Notification System**: Stay updated on:
  - New proposals
  - Contract signatures
  - Messages
  - Collaboration updates
- **Bookmark Feature**: Save interesting ideas for later review

### 8. AI Integration
- **Gemini AI Controller**: AI-powered features for enhanced user experience

## Application Architecture

### Backend Structure
```
backend/
├── server.js              # Main Express server with Socket.IO
├── db.js                  # MySQL connection pool
├── controllers/           # Business logic
│   ├── authController.js
│   ├── ideaController.js
│   ├── proposalController.js
│   ├── collaborationsController.js
│   ├── contractBuilderController.js
│   ├── developerController.js
│   ├── entrepreneurController.js
│   ├── bookmarkController.js
│   ├── notificationsController.js
│   ├── geminiController.js
│   └── signedController.js
├── routes/                # API route definitions
├── middleware/            # JWT authentication
├── messages/              # Socket.IO messaging logic
└── utils/                 # Password reset utilities
```

### Frontend Structure
```
frontend/
├── client/
│   ├── pages/             # Main application pages
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── DeveloperSignup.tsx
│   │   ├── EntrepreneurSignup.tsx
│   │   ├── DeveloperDashboard.tsx
│   │   ├── EntrepreneurDashboard.tsx
│   │   ├── PostIdea.tsx
│   │   ├── IdeaDetails.tsx
│   │   ├── ProposalSubmit.tsx
│   │   ├── ManageProposals.tsx
│   │   ├── ContractBuilder.tsx
│   │   ├── ContractReview.tsx
│   │   ├── CollaborationManagement.tsx
│   │   ├── ContributionTracker.tsx
│   │   ├── Messages.tsx
│   │   ├── Notifications.tsx
│   │   └── Settings.tsx
│   ├── components/        # Reusable UI components
│   ├── api/               # API client functions
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── layout/            # Layout components
└── server/                # Server-side rendering setup
```

## API Endpoints

### Authentication
- `POST /developers/signup` - Developer registration
- `POST /entrepreneur/signup` - Entrepreneur registration
- `POST /login` - User authentication
- `POST /forgot-password` - Password recovery
- `POST /reset-password` - Password reset

### Ideas
- `POST /idea` - Create new idea (with file upload)
- `GET /ideas` - Fetch all ideas
- `GET /idea/:id` - Get specific idea
- `PUT /idea/:id` - Update idea

### Proposals
- `POST /proposals` - Submit proposal
- `GET /proposals` - Get all proposals
- `GET /proposals/:id` - Get specific proposal
- Various status update endpoints

### Contracts
- `POST /contracts` - Create contract
- `GET /contracts/:id` - Get contract details
- `POST /contracts/sign` - Sign contract

### Collaborations
- `GET /collaborations/:entrepreneurId` - Get user collaborations
- Various contribution tracking endpoints

### Notifications & Bookmarks
- `GET /notifications/:userId` - Get user notifications
- `POST /bookmarks` - Add bookmark
- `GET /bookmarks/:userId` - Get user bookmarks

### Messages
- Real-time messaging via Socket.IO
- REST endpoints for message history

## Database Schema (Key Tables)

- **developers** - Developer user accounts
- **entrepreneur** - Entrepreneur user accounts
- **entrepreneur_idea** - Posted project ideas
- **proposals** - Developer proposals with milestones
- **contracts** - Legal agreements between parties
- **collaborations** - Active project partnerships
- **notifications** - User notifications
- **bookmarks** - Saved ideas
- **messages** - Chat messages

## Deployment & Infrastructure

### Frontend
- Build output: `/frontend/dist/spa`
- Deployment: Netlify (configured)
- Production URL: `https://zero-fund-frontend.onrender.com`

### Backend
- Server port: 5000 (configurable via .env)
- Hosted on: AWS RDS for database
- File storage: AWS S3
- Environment variables required:
  - Database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)
  - AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET)
  - JWT secret
  - Email service credentials

### CORS Configuration
- Allowed origins:
  - `http://localhost:8080`
  - `http://localhost:3000`
  - `https://zero-fund-frontend.onrender.com`

## Key Workflows

### 1. Entrepreneur Journey
1. Sign up as entrepreneur
2. Complete profile
3. Post project idea with details and equity offering
4. Review incoming developer proposals
5. Accept proposal and initiate contract builder
6. Sign contract
7. Manage collaboration and track contributions
8. Communicate via real-time chat

### 2. Developer Journey
1. Sign up as developer
2. Complete profile with skills
3. Browse available ideas
4. Submit detailed proposal with milestones
5. Negotiate terms via messaging
6. Review and sign contract
7. Track contributions and milestones
8. Collaborate on project delivery

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: JWT middleware validation
- **CORS Protection**: Restricted origin access
- **SQL Injection Prevention**: Parameterized queries
- **File Upload Validation**: Multer with memory storage
- **Environment Variables**: Sensitive data protection

## Development Setup

### Prerequisites
- Node.js (v14+)
- MySQL database
- AWS account (S3, RDS)
- Google Gemini API key

### Local Development
1. Clone repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Configure environment variables (.env)
5. Start backend: `npm run dev` (port 5000)
6. Start frontend: `npm run dev` (Vite dev server)

## Project Status

Based on git history:
- Active development
- Recent commits indicate ongoing improvements
- Both frontend and backend functional
- Production deployment configured

## Future Enhancements (Potential)

- Enhanced AI features via Gemini integration
- Advanced analytics dashboard
- Payment integration for equity management
- Mobile application
- Advanced search and filtering
- Rating and review system
- Legal document templates
- Project showcase gallery

---

**Last Updated**: 2025-11-17
**Version**: 1.0.0
**License**: ISC
