# Goal Integration Test Plan

## ✅ Implementation Complete

### Backend (Server)

- [x] Database migration applied
- [x] User model updated with goal fields
- [x] CRUD functions with lazy reset logic
- [x] API endpoints created and tested
- [x] Schema validation added

### Frontend (Client)

- [x] API client updated with goal endpoints
- [x] Activity page integrated with backend
- [x] Loading states added
- [x] Authentication handling added
- [x] Error handling and fallbacks added

## 🧪 Test Scenarios

### 1. Unauthenticated User

- [ ] Page loads with login prompt in goals section
- [ ] Progress shows loading state
- [ ] UTC countdown still works
- [ ] No API calls made

### 2. Authenticated User - First Load

- [ ] Page loads goal data from backend
- [ ] Progress bar shows correct values
- [ ] Goal input shows current target
- [ ] Save button works

### 3. Goal Updates

- [ ] Change goal value and save
- [ ] Backend updates correctly
- [ ] UI reflects changes immediately
- [ ] Error handling works if API fails

### 4. Daily Reset

- [ ] Progress resets at UTC midnight
- [ ] Backend lazy reset works
- [ ] Frontend countdown resets
- [ ] Progress bar resets to 0

### 5. Progress Increment

- [ ] Extension can call increment endpoint
- [ ] Progress updates correctly
- [ ] Lazy reset works on increment

## 🚀 Ready for Testing

The implementation is complete and ready for integration testing. The frontend now:

1. **Loads goal data** from backend on page load
2. **Saves goal changes** to backend when user updates
3. **Shows loading states** during API calls
4. **Handles authentication** gracefully
5. **Falls back to frontend-only** if API fails
6. **Maintains UTC countdown** for visual feedback

The backend provides:

1. **Lazy daily reset** at UTC midnight
2. **Goal management** endpoints
3. **Progress tracking** with automatic date handling
4. **Race-safe updates** with proper SQL

## 📋 API Endpoints Available

- `GET /api/me/goal` - Get goal info with lazy reset
- `PATCH /api/me/goal` - Update goal target
- `POST /api/me/goal/progress` - Increment progress

All endpoints require authentication and handle the lazy reset automatically.
