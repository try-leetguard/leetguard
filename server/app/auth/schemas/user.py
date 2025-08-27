from pydantic import BaseModel, EmailStr
from typing import Optional, Union
from datetime import date

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None

class User(UserBase):
    id: int
    display_name: Optional[str] = None
    is_verified: bool
    created_at: str

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    display_name: Optional[str] = None

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str

class EmailVerificationInput(BaseModel):
    email: EmailStr
    code: str

class SignupResponse(BaseModel):
    user: UserOut
    email_sent: bool
    message: str

class LoginVerificationResponse(BaseModel):
    message: str
    email_sent: bool
    verification_url: str

class GoalResponse(BaseModel):
    target_daily: int
    progress_today: int
    progress_date: date

class GoalUpdate(BaseModel):
    target_daily: int

class ProgressIncrement(BaseModel):
    delta: int = 1 