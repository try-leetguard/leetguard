# 🏗️ LeetGuard System Architecture

This document provides a comprehensive overview of the LeetGuard system architecture, including design decisions, data flow, and technical implementation details.

## 🎯 System Overview

LeetGuard is a **multi-platform productivity application** designed to help developers focus on coding by eliminating distractions and tracking productive activities. The system consists of three main components that work together to provide a seamless user experience.

## 🏛️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Extension     │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Chrome)      │
│                 │    │                 │    │                 │
│ • Web App       │    │ • REST API      │    │ • Content       │
│ • Dashboard     │    │ • Auth          │    │   Scripts       │
│ • Settings      │    │ • Database      │    │ • Background    │
│ • Analytics     │    │ • Email         │    │ • Popup         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User          │    │   PostgreSQL    │    │   Browser       │
│   Interface     │    │   Database      │    │   Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 Data Flow Architecture

### 1. **User Authentication Flow**
```
User Login → Frontend → Backend API → Database
     ↓
JWT Token ← Backend ← Database ← User Validation
     ↓
Token Storage → Extension Sync → Background Script
```

### 2. **Activity Tracking Flow**
```
Extension → Content Script → Background → Backend API
     ↓
Database Storage ← API Validation ← Data Processing
     ↓
Frontend Dashboard ← API Response ← Database Query
```

### 3. **Blocklist Management Flow**
```
User Input → Frontend → Backend API → Database
     ↓
Extension Sync ← API Response ← Database Update
     ↓
Content Script ← Background Script ← Storage Update
```

## 🎨 Frontend Architecture (Next.js 14)

### **App Router Structure**
```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page
├── globals.css         # Global styles
├── auth/               # Authentication routes
├── dashboard/          # Protected dashboard routes
├── settings/           # User settings
└── components/         # Reusable components
```

### **State Management Strategy**
- **React Context**: Global authentication state
- **Local State**: Component-specific state
- **Server State**: API data with React Query (planned)
- **Form State**: React Hook Form + Zod validation

### **Component Architecture**
```
Components/
├── ui/                 # Base UI components (shadcn/ui)
├── layout/             # Layout components
├── forms/              # Form components
├── charts/             # Data visualization
└── business/           # Business logic components
```

### **Styling Architecture**
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Modules**: Component-scoped styles
- **Radix UI**: Accessible component primitives
- **Design System**: Consistent spacing, colors, and typography

## 🖥️ Backend Architecture (FastAPI)

### **Application Structure**
```
app/
├── main.py             # FastAPI application entry point
├── config.py           # Configuration management
├── dependencies.py     # Dependency injection
├── auth/               # Authentication system
├── crud/               # Database operations
├── db/                 # Database configuration
└── utils/              # Utility functions
```

### **API Design Principles**
- **RESTful**: Standard HTTP methods and status codes
- **OpenAPI**: Automatic API documentation
- **Validation**: Pydantic schemas for request/response validation
- **Error Handling**: Consistent error response format
- **Rate Limiting**: Protection against abuse

### **Database Architecture**
```
Database Schema:
├── users               # User accounts and profiles
├── activities          # User activity tracking
├── blocklist          # Distraction blocking rules
├── verification_codes # Email verification
└── goals              # User productivity goals
```

### **Authentication System**
- **JWT Tokens**: Access and refresh token system
- **OAuth Integration**: Google and GitHub authentication
- **Password Security**: Bcrypt hashing with salt
- **Session Management**: Automatic token refresh
- **Rate Limiting**: Protection against brute force attacks

## 🔌 Extension Architecture (Chrome Extension)

### **Manifest V3 Structure**
```
Extension Components:
├── manifest.json       # Extension configuration
├── background.js       # Service worker
├── content.js          # Content script for LeetCode
├── popup.html/js      # Extension popup interface
├── injected.js         # Page injection script
└── webapp-detector.js  # Web application detection
```

### **Content Script Strategy**
- **LeetCode Integration**: Direct DOM manipulation for activity tracking
- **Webapp Detection**: Identify when user is on LeetGuard webapp
- **Message Passing**: Communication between content script and background
- **Storage Sync**: Local storage with backend synchronization

### **Background Service Worker**
- **Persistent State**: Maintain extension state across browser sessions
- **API Communication**: Handle backend API calls
- **Storage Management**: Chrome storage API integration
- **Event Handling**: Browser events and user actions

## 🗄️ Database Architecture

### **PostgreSQL Design**
```sql
-- Core Tables
users (
    id, email, hashed_password, display_name,
    is_verified, verification_code, created_at,
    daily_goal_minutes, streak_count
)

activities (
    id, user_id, start_time, end_time,
    duration_minutes, activity_type, notes
)

blocklist (
    id, user_id, website_url, is_active,
    created_at, updated_at
)

verification_codes (
    id, user_id, code, expires_at,
    is_used, created_at
)
```

### **Database Relationships**
- **One-to-Many**: User → Activities, User → Blocklist
- **Referential Integrity**: Foreign key constraints
- **Indexing Strategy**: Optimized for common queries
- **Migration Management**: Alembic for schema changes

### **Data Access Layer**
- **SQLAlchemy ORM**: Object-relational mapping
- **CRUD Operations**: Standardized database operations
- **Connection Pooling**: Efficient database connections
- **Transaction Management**: ACID compliance

## 🔐 Security Architecture

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Password Hashing**: Bcrypt with configurable rounds
- **OAuth Security**: Secure OAuth 2.0 implementation

### **API Security**
- **CORS Configuration**: Restricted to trusted origins
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Pydantic schema validation
- **SQL Injection Protection**: Parameterized queries

### **Data Security**
- **Encryption**: Sensitive data encryption at rest
- **Access Control**: Role-based permissions
- **Audit Logging**: User action tracking
- **Data Privacy**: GDPR compliance considerations

## 📊 Data Flow Patterns

### **Real-time Synchronization**
```
Extension ←→ Background ←→ Backend API ←→ Database
    ↓           ↓              ↓           ↓
Local Storage ←→ Chrome Storage ←→ JWT Tokens ←→ User Session
```

### **Offline Support**
- **Local Storage**: Extension data persistence
- **Sync Queue**: Pending operations when offline
- **Conflict Resolution**: Data consistency strategies
- **Background Sync**: Automatic synchronization

### **Data Consistency**
- **Eventual Consistency**: Distributed system design
- **Conflict Detection**: Identify and resolve conflicts
- **Data Validation**: Ensure data integrity
- **Rollback Mechanisms**: Error recovery strategies

## 🚀 Performance Architecture

### **Frontend Performance**
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching Strategy**: Browser and CDN caching
- **Bundle Optimization**: Tree shaking and minification

### **Backend Performance**
- **Async Operations**: Non-blocking I/O operations
- **Database Optimization**: Query optimization and indexing
- **Caching Layer**: Redis integration (planned)
- **Load Balancing**: Horizontal scaling support

### **Extension Performance**
- **Lazy Loading**: Load resources on demand
- **Background Processing**: Non-blocking background operations
- **Storage Optimization**: Efficient data storage
- **Memory Management**: Resource cleanup and optimization

## 🔄 Integration Patterns

### **API Integration**
- **RESTful APIs**: Standard HTTP-based communication
- **WebSocket Support**: Real-time updates (planned)
- **GraphQL**: Alternative API layer (future consideration)
- **API Versioning**: Backward compatibility support

### **Third-party Services**
- **Email Service**: Resend for transactional emails
- **OAuth Providers**: Google and GitHub authentication
- **Analytics**: User behavior tracking (planned)
- **Monitoring**: Application performance monitoring

### **Browser Integration**
- **Chrome APIs**: Extension-specific browser APIs
- **Content Scripts**: Page integration and manipulation
- **Background Scripts**: Persistent extension functionality
- **Storage APIs**: Chrome storage and sync APIs

## 🧪 Testing Architecture

### **Testing Strategy**
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing
- **Performance Tests**: Load and stress testing

### **Test Infrastructure**
- **Frontend Testing**: Jest + React Testing Library
- **Backend Testing**: Pytest + httpx
- **Extension Testing**: Chrome extension testing framework
- **Database Testing**: Isolated test database

### **Quality Assurance**
- **Code Coverage**: Maintain high test coverage
- **Static Analysis**: Linting and type checking
- **Security Scanning**: Vulnerability detection
- **Performance Monitoring**: Continuous performance tracking

## 🚀 Deployment Architecture

### **Frontend Deployment**
- **Static Generation**: Next.js static export
- **CDN Distribution**: Global content delivery
- **Environment Management**: Multiple environment support
- **Rollback Strategy**: Quick deployment rollback

### **Backend Deployment**
- **Containerization**: Docker container support
- **Load Balancing**: Horizontal scaling support
- **Database Migration**: Automated schema updates
- **Health Monitoring**: Application health checks

### **Extension Deployment**
- **Chrome Web Store**: Production distribution
- **Development Loading**: Local development support
- **Version Management**: Semantic versioning
- **Update Strategy**: Automatic update mechanisms

## 🔮 Future Architecture Considerations

### **Scalability Improvements**
- **Microservices**: Break down monolithic backend
- **Event Streaming**: Real-time data processing
- **Caching Layer**: Redis for performance optimization
- **CDN Integration**: Global content delivery

### **Advanced Features**
- **Machine Learning**: User behavior analysis
- **Real-time Collaboration**: Multi-user features
- **Mobile Applications**: Native mobile apps
- **Offline Support**: Enhanced offline capabilities

### **Integration Expansion**
- **More OAuth Providers**: Additional authentication options
- **API Integrations**: Third-party service connections
- **Webhook Support**: External system notifications
- **Plugin System**: Extensible architecture

## 📋 Architecture Decision Records (ADRs)

### **ADR-001: Next.js App Router**
- **Decision**: Use Next.js 14 App Router
- **Rationale**: Modern React patterns, improved performance
- **Alternatives**: Pages Router, Remix, SvelteKit
- **Consequences**: Learning curve, migration effort

### **ADR-002: FastAPI Backend**
- **Decision**: Python FastAPI framework
- **Rationale**: High performance, automatic documentation
- **Alternatives**: Django, Flask, Node.js
- **Consequences**: Python ecosystem, async support

### **ADR-003: Chrome Extension Manifest V3**
- **Decision**: Use Manifest V3 for extension
- **Rationale**: Future-proof, security improvements
- **Alternatives**: Manifest V2, WebExtensions
- **Consequences**: Service worker limitations, migration effort

### **ADR-004: PostgreSQL Database**
- **Decision**: PostgreSQL as primary database
- **Rationale**: ACID compliance, JSON support
- **Alternatives**: MongoDB, MySQL, SQLite
- **Consequences**: Relational model, SQL expertise required

## 📚 Architecture Resources

### **Design Patterns**
- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Object creation
- **Observer Pattern**: Event handling
- **Strategy Pattern**: Algorithm selection

### **Best Practices**
- **SOLID Principles**: Object-oriented design
- **DRY Principle**: Don't repeat yourself
- **KISS Principle**: Keep it simple, stupid
- **YAGNI Principle**: You aren't gonna need it

### **Reference Architectures**
- **Clean Architecture**: Separation of concerns
- **Hexagonal Architecture**: Ports and adapters
- **Event-Driven Architecture**: Asynchronous communication
- **Microservices Architecture**: Service decomposition

---

This architecture provides a solid foundation for the LeetGuard platform while maintaining flexibility for future enhancements and scalability improvements.

