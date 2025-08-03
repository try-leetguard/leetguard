from pydantic import BaseModel
from typing import Optional

# Schema for OAuth login request
class OAuthLoginRequest(BaseModel):
    provider: str  # "google" or "github"
    code: str
    redirect_uri: str

# Schema for OAuth user info
class OAuthUserInfo(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None

# Schema for OAuth login response
class OAuthLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: OAuthUserInfo 