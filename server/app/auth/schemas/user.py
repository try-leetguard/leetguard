from pydantic import BaseModel, EmailStr
from typing import Union

# Schema for user registration input. Used when a new user signs up.
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Schema for user output. Used to return user information in API responses.
class UserOut(BaseModel):
    id: int
    email: EmailStr
    display_name: Union[str, None] = None

    class Config:
        from_attributes = True

# Schema for updating user profile
class UserUpdate(BaseModel):
    display_name: Union[str, None] = None

# Schema for signup response that includes email status
class SignupResponse(BaseModel):
    user: UserOut
    email_sent: bool
    message: str

    class Config:
        from_attributes = True

# Schema for login response when email verification is needed
class LoginVerificationResponse(BaseModel):
    message: str
    email_sent: bool
    verification_url: str

# Schema for email verification input. Used when a user submits their code.
class EmailVerificationInput(BaseModel):
    email: EmailStr
    code: str 