from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.user import UserCreate, UserOut, EmailVerificationInput, SignupResponse, LoginVerificationResponse
from app.schemas.token import Token
from app.crud.user import get_user_by_email, create_user, verify_password
from app.utils import jwt as jwt_utils
from app.dependencies import get_current_user
from app.utils.email import send_verification_email, send_welcome_email
from datetime import datetime, timedelta, timezone
import random
from app.config import settings
from typing import Union

app = FastAPI()

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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
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
        user=new_user,
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
def refresh_token(refresh_token: str = Body(...)):
    payload = jwt_utils.decode_refresh_token(refresh_token)
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