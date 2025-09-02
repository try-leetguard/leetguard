# 🛠️ LeetGuard Development Guide

This guide will walk you through setting up the LeetGuard development environment, understanding the codebase, and contributing to the project.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Python** 3.8 or higher
- **PostgreSQL** 13 or higher
- **Git** for version control
- **Chrome/Edge** browser for extension development

### Recommended Tools
- **VS Code** with extensions:
  - Python
  - TypeScript and JavaScript
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
- **Postman** or **Insomnia** for API testing
- **pgAdmin** or **DBeaver** for database management

## 🏗️ Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd leetguard
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Return to root
cd ..
```

### 3. Environment Configuration

#### Frontend Environment (`.env.local`)
```bash
cd client
cp .env.example .env.local
```

Configure the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

#### Backend Environment (`.env`)
```bash
cd server
cp .env.example .env
```

Configure the following variables:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/leetguard_db

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@leetguard.com

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup

#### PostgreSQL Installation
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE leetguard_db;
CREATE USER leetguard_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE leetguard_db TO leetguard_user;
\q
```

#### Run Migrations
```bash
cd server
npm run migrate
```

### 5. Start Development Servers

#### Option 1: Start Both (Recommended)
```bash
# From root directory
npm run dev
```

#### Option 2: Start Individually
```bash
# Terminal 1 - Frontend
cd client
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

## 🔧 Development Workflow

### Frontend Development

#### Component Development
```bash
cd client
npm run dev
```

- **Location**: `client/components/`
- **Styling**: Tailwind CSS + Radix UI
- **State**: React Context + Custom hooks
- **Forms**: React Hook Form + Zod validation

#### Adding New Pages
1. Create directory in `client/app/`
2. Add `page.tsx` file
3. Update navigation if needed
4. Add to routing structure

#### Component Guidelines
- Use TypeScript for all components
- Follow the established component patterns
- Use shadcn/ui components when possible
- Implement proper error boundaries
- Add loading states for async operations

### Backend Development

#### API Development
```bash
cd server
npm run dev
```

- **Location**: `server/app/`
- **Framework**: FastAPI
- **Database**: SQLAlchemy + Alembic
- **Validation**: Pydantic schemas

#### Adding New Endpoints
1. Define schema in appropriate `schemas/` file
2. Add CRUD operations in `crud/` directory
3. Create endpoint in `main.py`
4. Add tests in `tests/` directory

#### Database Changes
```bash
cd server

# Create new migration
npm run migrate:create "description_of_changes"

# Apply migrations
npm run migrate

# Reset database (development only)
npm run db:reset
```

### Extension Development

#### Extension Setup
1. Open Chrome Extensions (`chrome://extensions/`)
2. Enable Developer Mode
3. Load unpacked extension from `extension/` folder
4. Make changes and click "Reload" to test

#### Development Workflow
```bash
# Make changes to extension files
# Reload extension in Chrome
# Test functionality
# Repeat
```

#### Key Files
- **`manifest.json`**: Extension configuration
- **`background.js`**: Service worker
- **`content.js`**: Content script for LeetCode
- **`popup.html/js`**: Extension popup interface

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Backend Testing
```bash
cd server
npm run test          # Run all tests
npm run test:coverage # Coverage report
```

### Testing Guidelines
- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

## 🔍 Code Quality

### Linting and Formatting

#### Frontend
```bash
cd client
npm run lint          # ESLint + TypeScript
npm run format        # Prettier formatting
```

#### Backend
```bash
cd server
npm run lint          # Flake8 linting
npm run format        # Black formatting
```

### Code Standards
- **TypeScript**: Strict mode enabled
- **Python**: PEP 8 compliance
- **React**: Functional components with hooks
- **FastAPI**: Async/await patterns
- **Database**: Proper indexing and relationships

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
```

Deploy the `.next` folder to:
- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**

### Backend Deployment
```bash
cd server
npm run build
```

Deploy to:
- **Railway**
- **Render**
- **Heroku**
- **AWS EC2**

### Extension Deployment
1. Build and test locally
2. Create production manifest
3. Submit to Chrome Web Store
4. Update version numbers

## 🐛 Debugging

### Frontend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Browser DevTools
# - React DevTools extension
# - Network tab for API calls
# - Console for errors
```

### Backend Debugging
```bash
# Enable debug logging
uvicorn app.main:app --reload --log-level debug

# Database debugging
cd server
npm run db:reset  # Reset test data
```

### Extension Debugging
```bash
# Chrome DevTools
# - Background page debugging
# - Content script debugging
# - Storage inspection
```

## 📚 Learning Resources

### Frontend
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

### Backend
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Alembic](https://alembic.sqlalchemy.org/)
- [Pydantic](https://docs.pydantic.dev/)

### Extension
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🤝 Contributing

### Development Process
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with conventional messages
6. **Push** and create a PR

### Commit Message Format
```
type(scope): description

feat(auth): add OAuth GitHub integration
fix(api): resolve user creation validation error
docs(readme): update installation instructions
```

### Pull Request Guidelines
- Clear description of changes
- Screenshots for UI changes
- Test coverage for new features
- Update documentation as needed
- Link related issues

## 🆘 Getting Help

### Common Issues
1. **Database Connection**: Check PostgreSQL service and credentials
2. **Port Conflicts**: Ensure ports 3000 and 8000 are available
3. **Dependencies**: Clear node_modules and reinstall
4. **Environment Variables**: Verify all required variables are set

### Support Channels
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and community help
- **Documentation**: Check existing docs first
- **Code Review**: Ask questions in PR comments

## 🎯 Next Steps

After setting up your development environment:

1. **Explore the codebase** using the structure documentation
2. **Run the application** and test basic functionality
3. **Pick a small issue** to start contributing
4. **Join the community** discussions
5. **Build something awesome** with LeetGuard!

---

**Happy coding! 🚀**

If you have any questions or run into issues, don't hesitate to ask for help in the GitHub discussions or issues.

