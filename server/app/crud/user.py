from sqlalchemy.orm import Session
from app.auth.models.user import User
from app.auth.schemas.user import UserCreate, UserUpdate
from passlib.context import CryptContext
import random
from datetime import datetime, timedelta, timezone

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Retrieves a user from the database by their email address. Used during login and registration to check for existing users.
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Creates a new user in the database with a hashed password. Used during user registration.
def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    verification_code = f"{random.randint(0, 999999):06d}"
    verification_code_expires = datetime.now(timezone.utc) + timedelta(minutes=10)
    now = datetime.now(timezone.utc)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        is_verified=False,
        verification_code=verification_code,
        verification_code_expires=verification_code_expires,
        last_code_sent_at=now
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Verifies that a plain password matches the hashed password stored in the database. Used during login.
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Retrieves a user from the database by their unique user ID. Used for protected routes to fetch the current user.
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Updates a user's profile information
def update_user_profile(db: Session, user_id: int, user_update: UserUpdate):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    # Update display name if provided
    if user_update.display_name is not None:
        db_user.display_name = user_update.display_name
    
    db.commit()
    db.refresh(db_user)
    return db_user