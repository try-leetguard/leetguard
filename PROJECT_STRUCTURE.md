# 📁 LeetGuard Project Structure

This document provides a detailed breakdown of the LeetGuard codebase structure, explaining the purpose and organization of each directory and key file.

## 🏗️ Root Directory Structure

```
leetguard/
├── 📁 client/                    # Next.js frontend application
├── 📁 server/                    # FastAPI backend server
├── 📁 extension/                 # Chrome browser extension
├── 📄 package.json               # Root workspace configuration
├── 📄 package-lock.json          # Dependency lock file
├── 📄 README.md                  # Main project documentation
├── 📄 PROJECT_STRUCTURE.md       # This file - detailed structure
├── 📄 .gitignore                 # Git ignore patterns
└── 📄 docs/                      # Additional documentation
```

## 🎨 Frontend (Client) Structure

### `/client` - Next.js 14 Application

```
client/
├── 📁 app/                       # Next.js App Router
│   ├── 📁 activity/             # Activity tracking pages
│   │   └── 📄 page.tsx          # Activity dashboard
│   ├── 📁 auth/                 # Authentication pages
│   │   ├── 📁 callback/         # OAuth callback handling
│   │   │   └── 📄 page.tsx      # OAuth callback page
│   │   └── 📄 auth-layout.tsx   # Auth layout wrapper
│   ├── 📁 blocked/              # Blocked sites page
│   │   └── 📄 page.tsx          # Blocked sites dashboard
│   ├── 📁 blocklist/            # Blocklist management
│   │   └── 📄 page.tsx          # Blocklist settings
│   ├── 📁 careers/              # Career-related pages
│   │   ├── 📁 anything-else/    # Additional career info
│   │   ├── 📁 software-engineer/ # Software engineering careers
│   │   └── 📄 page.tsx          # Main careers page
│   ├── 📁 extension-auth-callback/ # Extension auth handling
│   │   └── 📄 page.tsx          # Extension auth callback
│   ├── 📁 login/                # Login functionality
│   │   ├── 📄 layout.tsx        # Login layout
│   │   └── 📄 page.tsx          # Login page
│   ├── 📁 log/                  # Activity logging
│   │   └── 📄 page.tsx          # Log dashboard
│   ├── 📁 pricing/              # Pricing information
│   │   └── 📄 page.tsx          # Pricing page
│   ├── 📁 privacy/              # Privacy policy
│   │   └── 📄 page.tsx          # Privacy page
│   ├── 📁 settings/             # User settings
│   │   ├── 📁 data/             # Data management
│   │   ├── 📁 security/         # Security settings
│   │   └── 📄 page.tsx          # Main settings page
│   ├── 📁 signup/               # User registration
│   │   ├── 📄 layout.tsx        # Signup layout
│   │   └── 📄 page.tsx          # Signup page
│   ├── 📁 terms/                # Terms of service
│   │   └── 📄 page.tsx          # Terms page
│   ├── 📁 verify-email/         # Email verification
│   │   └── 📄 page.tsx          # Email verification page
│   ├── 📁 why-it-matters/       # Value proposition
│   │   └── 📄 page.tsx          # Why LeetGuard matters
│   ├── 📄 globals.css           # Global CSS styles
│   ├── 📄 LandingPage.tsx       # Main landing page component
│   ├── 📄 layout.tsx            # Root layout component
│   └── 📄 page.tsx              # Home page
├── 📁 components/                # Reusable UI components
│   ├── 📁 ui/                   # Base UI components (shadcn/ui)
│   │   ├── 📄 accordion.tsx     # Collapsible content
│   │   ├── 📄 alert-dialog.tsx  # Confirmation dialogs
│   │   ├── 📄 alert.tsx         # Alert notifications
│   │   ├── 📄 aspect-ratio.tsx  # Responsive aspect ratios
│   │   ├── 📄 avatar.tsx        # User avatar component
│   │   ├── 📄 badge.tsx         # Status badges
│   │   ├── 📄 breadcrumb.tsx    # Navigation breadcrumbs
│   │   ├── 📄 button.tsx        # Button components
│   │   ├── 📄 calendar.tsx      # Date picker
│   │   ├── 📄 card.tsx          # Card containers
│   │   ├── 📄 carousel.tsx      # Image carousel
│   │   ├── 📄 chart.tsx         # Data visualization
│   │   ├── 📄 checkbox.tsx      # Checkbox inputs
│   │   ├── 📄 collapsible.tsx   # Collapsible sections
│   │   ├── 📄 command.tsx       # Command palette
│   │   ├── 📄 context-menu.tsx  # Right-click menus
│   │   ├── 📄 dialog.tsx        # Modal dialogs
│   │   ├── 📄 drawer.tsx        # Slide-out panels
│   │   ├── 📄 dropdown-menu.tsx # Dropdown menus
│   │   ├── 📄 form.tsx          # Form components
│   │   ├── 📄 hover-card.tsx    # Hover information cards
│   │   ├── 📄 input-otp.tsx     # OTP input fields
│   │   ├── 📄 input.tsx         # Text inputs
│   │   ├── 📄 label.tsx         # Form labels
│   │   ├── 📄 menubar.tsx       # Menu bars
│   │   ├── 📄 navigation-menu.tsx # Navigation menus
│   │   ├── 📄 pagination.tsx    # Page navigation
│   │   ├── 📄 popover.tsx       # Popover content
│   │   ├── 📄 progress.tsx      # Progress indicators
│   │   ├── 📄 radio-group.tsx   # Radio button groups
│   │   ├── 📄 resizable.tsx     # Resizable panels
│   │   ├── 📄 scroll-area.tsx   # Custom scroll areas
│   │   ├── 📄 select.tsx        # Select dropdowns
│   │   ├── 📄 separator.tsx     # Visual separators
│   │   ├── 📄 sheet.tsx         # Slide-out sheets
│   │   ├── 📄 skeleton.tsx      # Loading skeletons
│   │   ├── 📄 slider.tsx        # Range sliders
│   │   ├── 📄 sonner.tsx        # Toast notifications
│   │   ├── 📄 switch.tsx        # Toggle switches
│   │   ├── 📄 table.tsx         # Data tables
│   │   ├── 📄 tabs.tsx          # Tabbed content
│   │   ├── 📄 textarea.tsx      # Multi-line text inputs
│   │   ├── 📄 toast.tsx         # Toast system
│   │   ├── 📄 toaster.tsx       # Toast container
│   │   ├── 📄 toggle-group.tsx  # Toggle button groups
│   │   └── 📄 tooltip.tsx       # Tooltip overlays
│   ├── 📄 Features.tsx          # Features showcase
│   ├── 📄 Footer.tsx            # Site footer
│   ├── 📄 Hero.tsx              # Hero section
│   ├── 📄 LogoCarousel.tsx      # Logo showcase
│   ├── 📄 MarketingPageWrapper.tsx # Marketing page wrapper
│   ├── 📄 NavbarDark.tsx        # Dark navigation bar
│   ├── 📄 NavbarLight.tsx       # Light navigation bar
│   ├── 📄 ProtectedRoute.tsx    # Route protection component
│   ├── 📄 Quote.tsx             # Testimonial quotes
│   ├── 📄 ReverseProtectedRoute.tsx # Reverse route protection
│   └── 📄 Sidebar.tsx           # Sidebar navigation
├── 📁 hooks/                     # Custom React hooks
│   └── 📄 use-toast.ts          # Toast notification hook
├── 📁 lib/                       # Utility libraries
│   ├── 📄 activity-api.ts       # Activity API client
│   ├── 📄 api.ts                # Main API client
│   ├── 📄 auth-context.tsx      # Authentication context
│   ├── 📄 blocklist-api.ts      # Blocklist API client
│   ├── 📄 utils.ts              # Utility functions
│   └── 📄 validation.ts         # Form validation schemas
├── 📁 types/                     # TypeScript type definitions
│   └── 📄 extension.d.ts        # Extension-related types
├── 📄 components.json            # shadcn/ui configuration
├── 📄 next-env.d.ts             # Next.js type definitions
├── 📄 next.config.js             # Next.js configuration
├── 📄 package.json               # Frontend dependencies
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 tailwind.config.ts         # Tailwind CSS configuration
└── 📄 tsconfig.json              # TypeScript configuration
```

## 🖥️ Backend (Server) Structure

### `/server` - FastAPI Python Backend

```
server/
├── 📁 alembic/                   # Database migrations
│   ├── 📄 env.py                 # Alembic environment
│   ├── 📄 README                 # Migration documentation
│   ├── 📄 script.py.mako         # Migration template
│   └── 📁 versions/              # Migration files
│       ├── 📄 0b96519e2e60_add_resend_rate_limiting_fields_to_user.py
│       ├── 📄 480dbd148350_remove_resend_count_from_user.py
│       ├── 📄 9a01f9570f86_add_email_verification_fields_to_user.py
│       ├── 📄 acknowledge_existing_tables.py
│       ├── 📄 add_daily_goal_fields.py
│       ├── 📄 b080fead1ec8_remove_time_spent_and_notes_from_.py
│       └── 📄 bcb728c49f78_add_display_name_to_user.py
├── 📁 app/                       # Main application code
│   ├── 📁 auth/                  # Authentication system
│   │   ├── 📁 models/            # Database models
│   │   │   └── 📄 user.py        # User model
│   │   └── 📁 schemas/           # Pydantic schemas
│   │       ├── 📄 data.py        # Data schemas
│   │       ├── 📄 oauth.py       # OAuth schemas
│   │       ├── 📄 token.py       # Token schemas
│   │       └── 📄 user.py        # User schemas
│   ├── 📁 crud/                  # Database operations
│   │   ├── 📄 data.py            # Data CRUD operations
│   │   └── 📄 user.py            # User CRUD operations
│   ├── 📁 db/                    # Database configuration
│   │   └── 📄 session.py         # Database session management
│   ├── 📁 utils/                 # Utility functions
│   │   ├── 📄 email.py           # Email functionality
│   │   ├── 📄 jwt.py             # JWT token handling
│   │   └── 📄 oauth.py           # OAuth integration
│   ├── 📄 config.py              # Application configuration
│   ├── 📄 dependencies.py        # FastAPI dependencies
│   └── 📄 main.py                # Main FastAPI application
├── 📁 tests/                     # Test suite
│   ├── 📁 e2e/                   # End-to-end tests
│   ├── 📁 integration/           # Integration tests
│   │   ├── 📄 test_auth_endpoints.py
│   │   └── 📄 test_email_integration.py
│   └── 📁 unit/                  # Unit tests
│       ├── 📄 test_auth.py
│       └── 📄 test_email.py
├── 📄 alembic.ini                # Alembic configuration
├── 📄 API_EXAMPLES.md            # API usage examples
├── 📄 EMAIL_SETUP.md             # Email configuration guide
├── 📄 package.json               # Server npm scripts
├── 📄 pytest.ini                 # Pytest configuration
├── 📄 README.md                  # Server documentation
├── 📄 requirements.txt            # Python dependencies
├── 📄 run_tests.py               # Test runner script
├── 📄 test_api.py                # API testing script
├── 📄 test_from_emails.py        # Email testing
├── 📄 test_resend.py             # Resend API testing
├── 📄 test_simple.py             # Simple tests
├── 📄 test_verification_email.py # Email verification testing
└── 📄 TESTING.md                 # Testing documentation
```

## 🔌 Extension Structure

### `/extension` - Chrome Browser Extension

```
extension/
├── 📁 icons/                     # Extension icons
│   └── 📄 leetguard-logo-black.png # Extension logo
├── 📄 activity-logger.js         # Activity tracking script
├── 📄 auth.js                    # Authentication handling
├── 📄 background.js              # Service worker background script
├── 📄 blocklist-sync.js          # Blocklist synchronization
├── 📄 content.js                 # Content script for LeetCode
├── 📄 injected.js                # Injected script for web pages
├── 📄 manifest.json              # Extension manifest
├── 📄 popup.html                 # Extension popup interface
├── 📄 popup.js                   # Popup functionality
├── 📄 README.md                  # Extension documentation
├── 📄 styles.css                 # Extension styles
└── 📄 webapp-detector.js         # Web application detection
```

## 📚 Documentation Structure

### `/docs` - Additional Documentation

```
docs/
├── 📄 ARCHITECTURE.md            # System architecture details
├── 📄 API_REFERENCE.md           # Complete API documentation
├── 📄 DEPLOYMENT.md              # Deployment guides
├── 📄 DEVELOPMENT.md             # Development setup guide
├── 📄 EXTENSION_DEVELOPMENT.md   # Extension development guide
└── 📄 TROUBLESHOOTING.md         # Common issues and solutions
```

## 🔧 Configuration Files

### Root Level Configuration
- **`package.json`**: Workspace configuration, scripts, and dependencies
- **`.gitignore`**: Git ignore patterns for the entire project
- **`README.md`**: Main project documentation and setup guide

### Frontend Configuration
- **`next.config.js`**: Next.js framework configuration
- **`tailwind.config.ts`**: Tailwind CSS styling configuration
- **`tsconfig.json`**: TypeScript compiler configuration
- **`components.json`**: shadcn/ui component library configuration

### Backend Configuration
- **`alembic.ini`**: Database migration configuration
- **`pytest.ini`**: Python testing configuration
- **`requirements.txt`**: Python package dependencies

### Extension Configuration
- **`manifest.json`**: Chrome extension manifest and permissions

## 🚀 Key Entry Points

### Frontend Entry Points
1. **`client/app/page.tsx`**: Home page component
2. **`client/app/layout.tsx`**: Root layout wrapper
3. **`client/app/globals.css`**: Global styles

### Backend Entry Points
1. **`server/app/main.py`**: FastAPI application entry point
2. **`server/app/config.py`**: Configuration management
3. **`server/alembic/env.py`**: Database migration environment

### Extension Entry Points
1. **`extension/manifest.json`**: Extension configuration
2. **`extension/background.js`**: Service worker background
3. **`extension/content.js`**: Content script for web pages

## 📊 Data Flow Architecture

```
User Action → Extension → Backend API → Database
     ↓
Frontend Dashboard ← Backend API ← Database
```

## 🔐 Security Structure

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Data Validation**: Pydantic schemas for API validation
- **CORS**: Configured for specific origins
- **Rate Limiting**: Email verification rate limiting

## 🧪 Testing Structure

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user flow testing
- **Database Tests**: Isolated test database
- **Extension Tests**: Browser extension functionality

This structure provides a clear separation of concerns while maintaining a cohesive development experience across all components of the LeetGuard platform.

