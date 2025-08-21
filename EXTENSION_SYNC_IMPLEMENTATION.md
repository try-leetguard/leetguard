# Extension & Web App Sync Implementation

## Overview

This implementation enables seamless synchronization between the LeetGuard browser extension and web application, allowing users to:

1. **Authenticate** through the web app and sync with the extension
2. **Sync blocklist** - customize blocked websites in the web app and have them applied in the extension
3. **Log activities** - LeetCode submissions are automatically tracked and sent to the backend
4. **Real-time sync** - periodic synchronization keeps data up-to-date across devices

## Architecture

### Extension Components

#### 1. Authentication System (`auth.js`)

- **Purpose**: Handles JWT token management and API authentication
- **Features**:
  - Token storage in Chrome extension storage
  - Automatic token refresh
  - OAuth callback handling
  - Authenticated API requests with retry logic

#### 2. Blocklist Sync (`blocklist-sync.js`)

- **Purpose**: Synchronizes user's custom blocklist with the backend
- **Features**:
  - Fetches user's blocklist from API
  - Falls back to default sites when not authenticated
  - Caches blocklist locally for offline access
  - Add/remove websites through API calls

#### 3. Activity Logger (`activity-logger.js`)

- **Purpose**: Tracks LeetCode problem submissions and syncs with backend
- **Features**:
  - Logs completed problems with metadata
  - Stores activities locally when offline
  - Syncs pending activities when connection restored
  - Provides activity statistics

#### 4. Updated Background Script (`background.js`)

- **Features**:
  - Dynamic blocklist loading from user preferences
  - OAuth callback handling
  - Periodic sync (every 10 minutes)
  - Activity logging on problem completion

#### 5. Updated Content Script (`content.js`)

- **Features**:
  - OAuth callback detection and handling
  - LeetCode submission tracking

#### 6. Updated Popup (`popup.js`)

- **Features**:
  - Authentication status display
  - Dynamic UI based on login state

### Web App Components

#### 1. Extension Auth Callback (`/extension-auth-callback`)

- **Purpose**: Handles OAuth flow completion for extension
- **Features**:
  - Receives authentication tokens
  - Sends tokens to extension via postMessage
  - Auto-closes after successful auth

#### 2. Enhanced Blocklist Page (`/blocklist`)

- **Features**:
  - Extension connection detection
  - Real-time sync status indicator
  - Extension installation prompts

### Backend API Integration

The extension integrates with existing backend APIs:

- **Authentication**: `/auth/login`, `/auth/refresh`
- **Blocklist**: `/api/blocklist/*` endpoints
- **Activity**: `/api/activity/*` endpoints

## User Flow

### Initial Setup

1. User installs LeetGuard extension
2. Extension shows default blocklist (hardcoded sites)
3. User clicks "Login to Customize" in extension popup
4. Redirected to web app login page
5. After login, tokens are passed back to extension
6. Extension fetches user's custom blocklist and starts syncing

### Ongoing Usage

1. **Blocklist Changes**: User modifies blocklist in web app → automatically syncs to extension
2. **LeetCode Activity**: User solves problems → extension logs to backend → appears in web app dashboard
3. **Multi-device**: Changes sync across all devices where user is logged in

## Sync Mechanisms

### 1. Real-time Sync

- OAuth callback triggers immediate sync
- Web app changes notify extension via postMessage

### 2. Periodic Sync

- Every 10 minutes: blocklist and pending activities
- Every 5 minutes: blocklist only
- Every 2 minutes: pending activities only

### 3. Offline Support

- Extension caches user data locally
- Activities stored locally when offline
- Automatic sync when connection restored

## Security Features

1. **JWT Token Management**: Secure token storage and automatic refresh
2. **CORS Protection**: Configured origins in backend
3. **OAuth Flow**: Secure token exchange between web app and extension
4. **Origin Validation**: postMessage origin checking

## Installation & Setup

### Extension

1. Load extension in Chrome developer mode
2. Extension will use default blocklist until user logs in
3. Click "Login to Customize" to connect with web app account

### Web App

1. No changes required for existing users
2. Extension status indicator appears on blocklist page
3. OAuth callback route handles extension authentication

## Future Enhancements

1. **Real-time WebSocket sync** for instant updates
2. **Extension settings page** for advanced configuration
3. **Sync status dashboard** showing last sync times
4. **Conflict resolution** for simultaneous edits
5. **Export/import** blocklist functionality
6. **Team/shared blocklists** for organizations

## Technical Notes

- Extension uses Chrome Extension Manifest V3
- All API calls include proper error handling and fallbacks
- Local storage used for caching and offline support
- Periodic cleanup prevents storage bloat
- Comprehensive logging for debugging

This implementation provides a robust foundation for extension-web app synchronization while maintaining good user experience and data integrity.
