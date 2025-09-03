# 🌐 LeetGuard API Reference

This document provides a comprehensive reference for all LeetGuard API endpoints, including request/response schemas, authentication, and usage examples.

## 🔐 Authentication

### JWT Token System
LeetGuard uses JWT (JSON Web Tokens) for authentication with the following structure:

- **Access Token**: Short-lived (30 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Algorithm**: HS256 (HMAC with SHA-256)

### Token Format
```
Authorization: Bearer <access_token>
```

### Token Refresh
When an access token expires, use the refresh token to get a new one:
```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

## 📋 Base URL
```
Development: http://localhost:8000
Production:  https://api.leetguard.com
```

## 🔍 API Endpoints

### Health Check

#### GET /health
Check if the server and database are running.

**Response:**
```json
{
  "status": "ok"
}
```

### Authentication Endpoints

#### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "email_sent": true,
  "message": "Account created successfully! Please check your email for verification code."
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Email already registered or validation error
- `500`: Server error

#### POST /auth/login
Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "display_name": "John Doe",
    "is_verified": true,
    "daily_goal_minutes": 120,
    "streak_count": 5
  }
}
```

**Status Codes:**
- `200`: Login successful
- `401`: Invalid credentials
- `422`: Validation error

#### POST /auth/verify
Verify email address with verification code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully!",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_verified": true
  }
}
```

**Status Codes:**
- `200`: Email verified successfully
- `400`: Invalid verification code
- `404`: User not found

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Status Codes:**
- `200`: Token refreshed successfully
- `401`: Invalid refresh token
- `422`: Validation error

#### POST /auth/oauth/google
Authenticate with Google OAuth.

**Request Body:**
```json
{
  "code": "google_oauth_code",
  "redirect_uri": "http://localhost:3000/auth/callback"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "display_name": "John Doe",
    "is_verified": true
  }
}
```

#### POST /auth/oauth/github
Authenticate with GitHub OAuth.

**Request Body:**
```json
{
  "code": "github_oauth_code",
  "redirect_uri": "http://localhost:3000/auth/callback"
}
```

**Response:** Same as Google OAuth response.

### User Management Endpoints

#### GET /users/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "display_name": "John Doe",
  "is_verified": true,
  "daily_goal_minutes": 120,
  "streak_count": 5,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200`: User profile retrieved
- `401`: Unauthorized
- `404`: User not found

#### PUT /users/me
Update current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "display_name": "Jane Doe",
  "daily_goal_minutes": 180
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "display_name": "Jane Doe",
  "is_verified": true,
  "daily_goal_minutes": 180,
  "streak_count": 5,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200`: Profile updated successfully
- `400`: Validation error
- `401`: Unauthorized
- `422`: Invalid data

#### GET /users/goals
Get user goals and progress.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "daily_goal_minutes": 120,
  "current_streak": 5,
  "longest_streak": 12,
  "total_minutes_today": 90,
  "goal_completion_percentage": 75.0,
  "weekly_progress": [
    {"date": "2024-01-01", "minutes": 120, "completed": true},
    {"date": "2024-01-02", "minutes": 90, "completed": false}
  ]
}
```

#### PUT /users/goals
Update user goals.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "daily_goal_minutes": 150
}
```

**Response:**
```json
{
  "daily_goal_minutes": 150,
  "message": "Goal updated successfully"
}
```

### Activity Tracking Endpoints

#### POST /activities
Create a new activity record.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T11:30:00Z",
  "activity_type": "coding",
  "notes": "Solved 3 LeetCode problems"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T11:30:00Z",
  "duration_minutes": 90,
  "activity_type": "coding",
  "notes": "Solved 3 LeetCode problems",
  "created_at": "2024-01-01T11:30:00Z"
}
```

**Status Codes:**
- `201`: Activity created successfully
- `400`: Validation error
- `401`: Unauthorized
- `422`: Invalid data

#### GET /activities
Get user activities with pagination and filtering.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `start_date`: Filter activities from this date (ISO format)
- `end_date`: Filter activities until this date (ISO format)
- `activity_type`: Filter by activity type

**Response:**
```json
{
  "activities": [
    {
      "id": 1,
      "start_time": "2024-01-01T10:00:00Z",
      "end_time": "2024-01-01T11:30:00Z",
      "duration_minutes": 90,
      "activity_type": "coding",
      "notes": "Solved 3 LeetCode problems"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

#### GET /activities/{activity_id}
Get a specific activity by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T11:30:00Z",
  "duration_minutes": 90,
  "activity_type": "coding",
  "notes": "Solved 3 LeetCode problems",
  "created_at": "2024-01-01T11:30:00Z",
  "updated_at": "2024-01-01T11:30:00Z"
}
```

#### PUT /activities/{activity_id}
Update an existing activity.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "end_time": "2024-01-01T12:00:00Z",
  "notes": "Solved 3 LeetCode problems and reviewed solutions"
}
```

**Response:** Updated activity object.

#### DELETE /activities/{activity_id}
Delete an activity.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Activity deleted successfully"
}
```

#### GET /activities/stats
Get activity statistics and analytics.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `period`: Time period (today, week, month, year)
- `start_date`: Custom start date (ISO format)
- `end_date`: Custom end date (ISO format)

**Response:**
```json
{
  "total_minutes": 450,
  "total_sessions": 6,
  "average_session_length": 75,
  "longest_session": 120,
  "activity_breakdown": {
    "coding": 300,
    "reading": 90,
    "planning": 60
  },
  "daily_averages": {
    "monday": 90,
    "tuesday": 120,
    "wednesday": 75
  }
}
```

### Blocklist Management Endpoints

#### POST /blocklist
Add a website to the blocklist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "website_url": "https://facebook.com",
  "is_active": true
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "website_url": "https://facebook.com",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /blocklist
Get user's blocklist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "blocklist": [
    {
      "id": 1,
      "website_url": "https://facebook.com",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### PUT /blocklist/{blocklist_id}
Update blocklist item.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "is_active": false
}
```

**Response:** Updated blocklist item.

#### DELETE /blocklist/{blocklist_id}
Remove item from blocklist.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Blocklist item removed successfully"
}
```

#### POST /blocklist/check
Check if a website is blocked for the user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "website_url": "https://facebook.com"
}
```

**Response:**
```json
{
  "is_blocked": true,
  "blocklist_item": {
    "id": 1,
    "website_url": "https://facebook.com",
    "is_active": true
  }
}
```

## 📊 Data Models

### User Model
```json
{
  "id": "integer",
  "email": "string (email)",
  "hashed_password": "string (nullable)",
  "display_name": "string (nullable)",
  "is_verified": "boolean",
  "verification_code": "string (nullable)",
  "daily_goal_minutes": "integer (default: 120)",
  "streak_count": "integer (default: 0)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Activity Model
```json
{
  "id": "integer",
  "user_id": "integer (foreign key)",
  "start_time": "datetime",
  "end_time": "datetime",
  "duration_minutes": "integer",
  "activity_type": "string",
  "notes": "string (nullable)",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Blocklist Model
```json
{
  "id": "integer",
  "user_id": "integer (foreign key)",
  "website_url": "string",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Verification Code Model
```json
{
  "id": "integer",
  "user_id": "integer (foreign key)",
  "code": "string",
  "expires_at": "datetime",
  "is_used": "boolean",
  "created_at": "datetime"
}
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "detail": "Error message description",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Request data validation failed
- `AUTHENTICATION_FAILED`: Invalid or expired token
- `USER_NOT_FOUND`: User does not exist
- `EMAIL_ALREADY_EXISTS`: Email is already registered
- `INVALID_VERIFICATION_CODE`: Verification code is incorrect
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error

## 🔒 Rate Limiting

### Rate Limits
- **Authentication endpoints**: 10 requests per hour per IP
- **Email verification**: 5 requests per hour per user
- **General API**: 1000 requests per hour per user
- **File uploads**: 50 requests per hour per user

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📝 Usage Examples

### Complete Authentication Flow
```bash
# 1. Create account
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 2. Verify email (check email for code)
curl -X POST http://localhost:8000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "code": "123456"}'

# 3. Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 4. Use access token for authenticated requests
curl -X GET http://localhost:8000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Activity Tracking Example
```bash
# Start a coding session
curl -X POST http://localhost:8000/activities \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "start_time": "2024-01-01T10:00:00Z",
    "end_time": "2024-01-01T11:30:00Z",
    "activity_type": "coding",
    "notes": "Solved LeetCode problems"
  }'

# Get activity statistics
curl -X GET "http://localhost:8000/activities/stats?period=week" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Blocklist Management Example
```bash
# Add distracting website to blocklist
curl -X POST http://localhost:8000/blocklist \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"website_url": "https://facebook.com", "is_active": true}'

# Check if website is blocked
curl -X POST http://localhost:8000/blocklist/check \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"website_url": "https://facebook.com"}'
```

## 🔧 SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @leetguard/api-client
```

```typescript
import { LeetGuardClient } from '@leetguard/api-client';

const client = new LeetGuardClient({
  baseUrl: 'http://localhost:8000',
  accessToken: 'your_access_token'
});

// Get user profile
const user = await client.users.getMe();

// Create activity
const activity = await client.activities.create({
  start_time: new Date(),
  end_time: new Date(),
  activity_type: 'coding',
  notes: 'Working on project'
});
```

### Python
```bash
pip install leetguard-api-client
```

```python
from leetguard_api_client import LeetGuardClient

client = LeetGuardClient(
    base_url="http://localhost:8000",
    access_token="your_access_token"
)

# Get user profile
user = client.users.get_me()

# Create activity
activity = client.activities.create(
    start_time=datetime.now(),
    end_time=datetime.now(),
    activity_type="coding",
    notes="Working on project"
)
```

## 📚 Additional Resources

- **Interactive API Docs**: Visit `/docs` endpoint for Swagger UI
- **OpenAPI Schema**: Download OpenAPI specification from `/openapi.json`
- **Postman Collection**: Import our Postman collection for testing
- **SDK Documentation**: Complete SDK documentation and examples
- **Community Support**: Join our Discord for API-related questions

---

This API reference covers all the essential endpoints and functionality of the LeetGuard platform. For additional support or questions, please refer to our documentation or reach out to our development team.

