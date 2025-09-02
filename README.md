# 🚀 LeetGuard - Your Coding Companion

> **Take back control of your interview preparation with LeetGuard**

LeetGuard is a comprehensive productivity platform designed to help developers focus on coding by eliminating distractions and tracking productive activities. Built with modern technologies and a focus on user experience.

## 🏗️ Architecture Overview

LeetGuard consists of three main components working together:

### 1. **Frontend Web Application** (`/client`)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Context + Custom hooks
- **Authentication**: JWT-based with OAuth support (Google, GitHub)
- **Features**: Landing page, user dashboard, settings, activity tracking

### 2. **Backend API Server** (`/server`)
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with refresh mechanism
- **Email**: Resend integration for verification emails
- **Features**: User management, activity logging, blocklist management

### 3. **Browser Extension** (`/extension`)
- **Platform**: Chrome Extension Manifest V3
- **Content Scripts**: LeetCode integration, webapp detection
- **Background**: Service worker for persistent functionality
- **Features**: Distraction blocking, activity tracking, auth sync

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Python 3.8+
- PostgreSQL database
- Chrome/Edge browser for extension

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd leetguard
npm run setup
```

2. **Environment Configuration**
```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Configure your database and API keys
```

3. **Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client    # Frontend on http://localhost:3000
npm run dev:server    # Backend on http://localhost:8000
```

4. **Load Extension**
- Open Chrome Extensions (`chrome://extensions/`)
- Enable Developer Mode
- Load unpacked extension from `/extension` folder

## 📁 Project Structure

```
leetguard/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities, API client, auth
│   └── types/            # TypeScript definitions
├── server/                # FastAPI backend
│   ├── app/              # Application code
│   │   ├── auth/         # Authentication models/schemas
│   │   ├── crud/         # Database operations
│   │   └── utils/        # Helper functions
│   ├── alembic/          # Database migrations
│   └── tests/            # Test suite
├── extension/             # Chrome extension
│   ├── content.js        # Content script for LeetCode
│   ├── background.js     # Service worker
│   └── popup.html       # Extension popup
└── docs/                 # Documentation
```

## 🔧 Development Commands

### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run test             # Run all tests
npm run lint             # Lint all code
npm run clean            # Clean build artifacts
```

### Frontend (Client)
```bash
cd client
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # ESLint + TypeScript check
```

### Backend (Server)
```bash
cd server
npm run dev              # Start FastAPI with auto-reload
npm run test             # Run pytest suite
npm run lint             # Flake8 linting
npm run format           # Black code formatting
npm run migrate          # Run database migrations
```

## 🔐 Authentication Flow

1. **User Registration**: Email/password or OAuth (Google/GitHub)
2. **Email Verification**: Required for new accounts
3. **JWT Tokens**: Access + refresh token system
4. **Extension Sync**: Auth tokens automatically sync to browser extension
5. **Session Management**: Automatic token refresh and validation

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts, preferences, goals
- **activities**: Coding session tracking
- **blocklist**: Distracting websites to block
- **verification_codes**: Email verification management

### Key Features
- **Daily Goals**: Set and track coding targets
- **Progress Tracking**: Monitor time spent and achievements
- **Blocklist Management**: Customize distraction blocking
- **Activity Analytics**: Detailed productivity insights

## 🌐 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify` - Email verification
- `POST /auth/refresh` - Token refresh

### User Management
- `GET /users/me` - Current user profile
- `PUT /users/me` - Update profile
- `GET /users/goals` - User goals and progress

### Activity & Blocklist
- `POST /activities` - Log coding activity
- `GET /activities` - Retrieve activity history
- `POST /blocklist` - Add blocking rules
- `GET /blocklist` - Get current blocklist

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with Jest/React Testing Library
- **E2E Tests**: Playwright for critical user flows
- **Type Checking**: TypeScript strict mode

### Backend Testing
- **Unit Tests**: Pytest for individual functions
- **Integration Tests**: API endpoint testing
- **Database Tests**: Isolated test database

## 🚀 Deployment

### Frontend
- **Platform**: Vercel (recommended) or any static hosting
- **Build**: `npm run build` generates optimized static files
- **Environment**: Configure API endpoints for production

### Backend
- **Platform**: Railway, Render, or any Python hosting
- **Database**: Managed PostgreSQL service
- **Environment**: Set production environment variables

### Extension
- **Distribution**: Chrome Web Store (production) or unpacked (development)
- **Updates**: Automatic through Chrome Web Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use conventional commit messages
- Write tests for new features
- Update documentation as needed

## 📚 Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State**: React Context + Custom hooks
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **Database**: PostgreSQL + SQLAlchemy
- **Authentication**: JWT + Passlib
- **Email**: Resend API
- **Testing**: Pytest + httpx

### Extension
- **Platform**: Chrome Extension Manifest V3
- **Content Scripts**: Vanilla JavaScript
- **Storage**: Chrome Storage API
- **Networking**: Declarative Net Request API

## 🔍 Key Features

### 🎯 **Focus Mode**
- Block distracting websites during coding sessions
- Customizable blocklist management
- Smart detection of coding platforms

### 📊 **Progress Tracking**
- Daily coding goals and achievements
- Time tracking for productive sessions
- Detailed analytics and insights

### 🔐 **Secure Authentication**
- Multi-provider OAuth support
- Email verification system
- JWT-based session management

### 🌐 **Cross-Platform Sync**
- Web application + browser extension
- Real-time data synchronization
- Seamless user experience

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check PostgreSQL service and credentials
2. **Email Sending**: Verify Resend API key configuration
3. **Extension Loading**: Ensure manifest.json is valid
4. **CORS Errors**: Check backend CORS configuration

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check database migrations
cd server && npm run migrate:create "description"
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by productivity tools like Forest and RescueTime
- Community-driven development approach

---

**Ready to boost your coding productivity? Get started with LeetGuard today! 🚀**
