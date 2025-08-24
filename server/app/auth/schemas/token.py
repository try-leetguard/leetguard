from pydantic import BaseModel

# Schema for refresh token requests
class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Schema for authentication tokens. Used to return access and refresh tokens after login or refresh.
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str 