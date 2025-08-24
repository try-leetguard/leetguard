from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.auth.schemas.user import UserCreate, UserOut, UserUpdate, EmailVerificationInput, SignupResponse, LoginVerificationResponse
from app.auth.schemas.token import Token, RefreshTokenRequest
from app.crud.user import get_user_by_email, create_user, verify_password, update_user_profile
from app.utils import jwt as jwt_utils
from app.dependencies import get_current_user
from app.utils.email import send_verification_email, send_welcome_email
from app.utils.oauth import (
    exchange_google_code, exchange_github_code,
    get_google_user_info, get_github_user_info
)
from app.auth.schemas.oauth import OAuthLoginRequest, OAuthUserInfo
from app.auth.schemas.data import BlocklistItemCreate, BlocklistResponse, ActivityCreate, ActivityUpdate, ActivityResponse, ActivitiesResponse
from app.crud.data import (
    create_blocklist_item, get_user_blocklist, delete_blocklist_item_by_website, check_website_blocked,
    create_activity, get_user_activities, get_activity, update_activity, delete_activity, get_activity_stats
)
from datetime import datetime, timedelta, timezone
import random
from app.config import settings
from typing import Union
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://leetguard.com"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health check endpoint. Anyone can access this to check if the server and database are running.
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    return {"status": "ok"}

# User registration endpoint. Allows anyone to sign up with an email and password.
@app.post("/auth/signup", response_model=SignupResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    
    if db_user:
        # Check if this is an OAuth user trying to add a password
        if not db_user.hashed_password or db_user.hashed_password is None:
            # OAuth user wants to add password - update their account
            from app.crud.user import update_user_password
            update_user_password(db, db_user.id, user.password)
            
            # Send verification email for the updated account
            email_sent = send_verification_email(db_user.email, db_user.verification_code)
            
            if email_sent:
                message = "Password added successfully! Please check your email for verification code."
            else:
                message = "Password added successfully! However, we couldn't send the verification email. Please use the resend feature or contact support."
            
            return SignupResponse(
                user=UserOut(id=db_user.id, email=db_user.email),
                email_sent=email_sent,
                message=message
            )
        else:
            # Regular user trying to sign up with existing email
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create new user
    new_user = create_user(db, user)
    
    # Send verification email
    email_sent = send_verification_email(new_user.email, new_user.verification_code)
    
    if email_sent:
        message = "Account created successfully! Please check your email for verification code."
    else:
        message = "Account created successfully! However, we couldn't send the verification email. Please use the resend feature or contact support."
        # Log the failure for monitoring
        print(f"Warning: Failed to send verification email to {new_user.email}")
    
    return SignupResponse(
        user=UserOut(id=new_user.id, email=new_user.email),
        email_sent=email_sent,
        message=message
    )

# User login endpoint. Allows registered users to log in and receive access and refresh tokens.
@app.post("/auth/login", response_model=Union[Token, LoginVerificationResponse])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_verified:
        # Generate new verification code and send email
        now = datetime.now(timezone.utc)
        new_code = f"{random.randint(0, 999999):06d}"
        new_expiration = now + timedelta(minutes=10)
        user.verification_code = new_code
        user.verification_code_expires = new_expiration
        user.last_code_sent_at = now
        user.resend_cooldown_seconds = 30
        db.commit()
        
        # Send verification email
        email_sent = send_verification_email(user.email, new_code)
        
        if email_sent:
            message = "Please verify your email before logging in. A new verification code has been sent to your email."
        else:
            message = "Please verify your email before logging in. We couldn't send the verification email. Please use the resend feature."
            print(f"Warning: Failed to send verification email to {user.email}")
        
        # Return verification response instead of error
        verification_url = f"{settings.FRONTEND_URL}/verify-email"
        return LoginVerificationResponse(
            message=message,
            email_sent=email_sent,
            verification_url=verification_url
        )
    
    access_token = jwt_utils.create_access_token(data={"sub": str(user.id)})
    refresh_token = jwt_utils.create_refresh_token(data={"sub": str(user.id)})

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# Token refresh endpoint. Allows users to get new access and refresh tokens using a valid refresh token.
@app.post("/auth/refresh", response_model = Token)
def refresh_token(request: RefreshTokenRequest):
    payload = jwt_utils.decode_refresh_token(request.refresh_token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    if user_id is None: 
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token payload")
    
    access_token = jwt_utils.create_access_token(data={"sub": user_id})
    new_refresh_token = jwt_utils.create_refresh_token(data={"sub": user_id})

    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

# Protected endpoint. Returns the current user's information. Requires a valid access token (user must be logged in).
@app.get("/me", response_model=UserOut)
def read_current_user(current_user: UserOut = Depends(get_current_user)):
    return current_user

# Update user profile endpoint. Allows users to update their display name.
@app.put("/me", response_model=UserOut)
def update_profile(
    user_update: UserUpdate,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = update_user_profile(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return UserOut(
        id=updated_user.id,
        email=updated_user.email,
        display_name=updated_user.display_name
    )

# Email verification endpoint. Allows users to verify their email with a 6-digit code.
@app.post("/auth/verify-email-code")
def verify_email_code(data: EmailVerificationInput, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_verified:
        return {"message": "Email already verified."}
    if (
        user.verification_code != data.code or
        not user.verification_code_expires or
        user.verification_code_expires < datetime.now(timezone.utc)
    ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification code.")
    user.is_verified = True
    user.verification_code = None
    user.verification_code_expires = None
    user.resend_cooldown_seconds = 30
    user.last_code_sent_at = None
    db.commit()
    
    # Send welcome email (don't fail verification if email fails)
    welcome_sent = send_welcome_email(user.email, user.email)
    if not welcome_sent:
        print(f"Warning: Failed to send welcome email to {user.email}")
    
    return {"message": "Email verified successfully! Welcome to LeetGuard!"}

# Resend verification code endpoint. Allows users to request a new code if not yet verified.
@app.post("/auth/resend-verification-code")
def resend_verification_code(data: EmailVerificationInput, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_verified:
        return {"message": "Email already verified."}
    now = datetime.now(timezone.utc)
    # Cooldown logic - fixed 30 seconds
    if user.last_code_sent_at:
        elapsed = (now - user.last_code_sent_at).total_seconds()
        if elapsed < 30:  # Fixed 30-second cooldown
            wait_time = int(30 - elapsed)
            raise HTTPException(status_code=429, detail=f"You can request a new code in {wait_time} seconds.")
    # Generate new code and expiration
    new_code = f"{random.randint(0, 999999):06d}"
    new_expiration = now + timedelta(minutes=10)
    user.verification_code = new_code
    user.verification_code_expires = new_expiration
    user.last_code_sent_at = now
    # Set fixed 30-second cooldown
    user.resend_cooldown_seconds = 30
    db.commit()
    
    # Send verification email
    email_sent = send_verification_email(user.email, new_code)
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to send verification email. Please try again later or contact support if the problem persists."
        )
    
    return {"message": "Verification code resent successfully. Please check your email."}

# OAuth endpoints
@app.post("/auth/oauth/google")
async def google_oauth_login(oauth_data: OAuthLoginRequest, db: Session = Depends(get_db)):
    """Handle Google OAuth login"""
    print(f"Received OAuth data: {oauth_data}")
    # Exchange code for access token
    access_token = await exchange_google_code(oauth_data.code, oauth_data.redirect_uri)
    if not access_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to exchange code for token")
    
    # Get user info from Google
    user_info = await get_google_user_info(access_token)
    if not user_info:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get user info from Google")
    
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not provided by Google")
    
    # Check if user exists
    db_user = get_user_by_email(db, email)
    if not db_user:
        # Create new OAuth user
        from app.crud.user import create_oauth_user
        db_user = create_oauth_user(db, email, user_info.get("name"))
    
    # Generate JWT tokens
    jwt_access_token = jwt_utils.create_access_token(data={"sub": str(db_user.id)})
    jwt_refresh_token = jwt_utils.create_refresh_token(data={"sub": str(db_user.id)})
    
    return {
        "access_token": jwt_access_token,
        "refresh_token": jwt_refresh_token,
        "token_type": "bearer",
        "user": OAuthUserInfo(
            id=str(db_user.id),
            email=db_user.email,
            name=db_user.display_name,
            picture=user_info.get("picture")
        )
    }

# Blocklist endpoints
@app.post("/api/blocklist/add")
def add_blocklist_item(
    blocklist_data: BlocklistItemCreate,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a website to user's blocklist"""
    # Check if already exists
    if check_website_blocked(db, current_user.id, blocklist_data.website):
        raise HTTPException(status_code=400, detail="Website already in blocklist")
    
    # Add new item
    new_item = create_blocklist_item(db, current_user.id, blocklist_data.website)
    
    return {"message": "Website added to blocklist", "website": blocklist_data.website}

@app.delete("/api/blocklist/remove")
def remove_blocklist_item(
    blocklist_data: BlocklistItemCreate,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a website from user's blocklist"""
    success = delete_blocklist_item_by_website(db, current_user.id, blocklist_data.website)
    
    if not success:
        raise HTTPException(status_code=404, detail="Website not found in blocklist")
    
    return {"message": "Website removed from blocklist", "website": blocklist_data.website}

@app.get("/api/blocklist", response_model=BlocklistResponse)
def get_blocklist(
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's blocklist"""
    items = get_user_blocklist(db, current_user.id)
    return BlocklistResponse(websites=[item.website for item in items])

@app.get("/api/blocklist/check/{website}")
def check_blocklist(
    website: str,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if a website is in user's blocklist"""
    is_blocked = check_website_blocked(db, current_user.id, website)
    return {"website": website, "is_blocked": is_blocked}

# Activity endpoints
@app.post("/api/activity")
def add_activity(
    activity_data: ActivityCreate,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new activity (LeetCode problem)"""
    # Check if activity already exists for this problem
    existing = get_activity_by_problem_url(db, current_user.id, activity_data.problem_url)
    
    if existing:
        # Update existing activity
        update_data = ActivityUpdate(
            status=activity_data.status
        )
        updated_activity = update_activity(db, existing.id, current_user.id, update_data)
        return {"message": "Activity updated", "activity_id": updated_activity.id}
    else:
        # Create new activity
        new_activity = create_activity(db, current_user.id, activity_data)
        return {"message": "Activity created", "activity_id": new_activity.id}

@app.get("/api/activity", response_model=ActivitiesResponse)
def get_activities(
    limit: int = 100,
    offset: int = 0,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's activities with pagination"""
    activities = get_user_activities(db, current_user.id, limit, offset)
    
    # Convert topic_tags from JSON string back to list
    activity_responses = []
    for activity in activities:
        topic_tags = json.loads(activity.topic_tags) if activity.topic_tags else None
        activity_responses.append(ActivityResponse(
            id=activity.id,
            problem_name=activity.problem_name,
            problem_url=activity.problem_url,
            difficulty=activity.difficulty,
            topic_tags=topic_tags,
            status=activity.status,
            completed_at=activity.completed_at
        ))
    
    return ActivitiesResponse(activities=activity_responses)

@app.get("/api/activity/{activity_id}", response_model=ActivityResponse)
def get_activity_by_id(
    activity_id: int,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific activity by ID"""
    activity = get_activity(db, activity_id, current_user.id)
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    topic_tags = json.loads(activity.topic_tags) if activity.topic_tags else None
    return ActivityResponse(
        id=activity.id,
        problem_name=activity.problem_name,
        problem_url=activity.problem_url,
        difficulty=activity.difficulty,
        topic_tags=topic_tags,
        status=activity.status,
        completed_at=activity.completed_at
    )

@app.put("/api/activity/{activity_id}", response_model=ActivityResponse)
def update_activity_by_id(
    activity_id: int,
    activity_data: ActivityUpdate,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a specific activity"""
    updated_activity = update_activity(db, activity_id, current_user.id, activity_data)
    
    if not updated_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    topic_tags = json.loads(updated_activity.topic_tags) if updated_activity.topic_tags else None
    return ActivityResponse(
        id=updated_activity.id,
        problem_name=updated_activity.problem_name,
        problem_url=updated_activity.problem_url,
        difficulty=updated_activity.difficulty,
        topic_tags=topic_tags,
        status=updated_activity.status,
        completed_at=updated_activity.completed_at
    )

@app.delete("/api/activity/{activity_id}")
def delete_activity_by_id(
    activity_id: int,
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific activity"""
    success = delete_activity(db, activity_id, current_user.id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return {"message": "Activity deleted successfully"}

@app.get("/api/activity/stats")
def get_activity_statistics(
    current_user: UserOut = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's activity statistics"""
    stats = get_activity_stats(db, current_user.id)
    return stats

@app.post("/auth/oauth/github")
async def github_oauth_login(oauth_data: OAuthLoginRequest, db: Session = Depends(get_db)):
    """Handle GitHub OAuth login"""
    # Exchange code for access token
    access_token = await exchange_github_code(oauth_data.code, oauth_data.redirect_uri)
    if not access_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to exchange code for token")
    
    # Get user info from GitHub
    user_info = await get_github_user_info(access_token)
    if not user_info:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get user info from GitHub")
    
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not provided by GitHub")
    
    # Check if user exists
    db_user = get_user_by_email(db, email)
    if not db_user:
        # Create new OAuth user
        from app.crud.user import create_oauth_user
        db_user = create_oauth_user(db, email, user_info.get("name"))
    
    # Generate JWT tokens
    jwt_access_token = jwt_utils.create_access_token(data={"sub": str(db_user.id)})
    jwt_refresh_token = jwt_utils.create_refresh_token(data={"sub": str(db_user.id)})
    
    return {
        "access_token": jwt_access_token,
        "refresh_token": jwt_refresh_token,
        "token_type": "bearer",
        "user": OAuthUserInfo(
            id=str(db_user.id),
            email=db_user.email,
            name=db_user.display_name,
            picture=user_info.get("avatar_url")
        )
    }