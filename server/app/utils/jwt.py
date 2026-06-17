import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import uuid4
from app.config import settings

ALGORITHM = "HS256"

ACCESS_TOKEN_USE = "access"
REFRESH_TOKEN_USE = "refresh"

def _create_token(data: dict, token_use: str, secret_key: str, expires_delta: timedelta):
    now = datetime.now(timezone.utc)
    to_encode = data.copy()
    to_encode.update({
        "token_use": token_use,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "exp": now + expires_delta,
        "jti": str(uuid4()),
    })
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)

# Creates a JWT access token for a user. Used after successful login to authenticate future requests.
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    return _create_token(
        data=data,
        token_use=ACCESS_TOKEN_USE,
        secret_key=settings.SECRET_KEY,
        expires_delta=expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

# Decodes and verifies a JWT access token. Returns the payload if valid, otherwise None.
def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )
        if payload.get("token_use") != ACCESS_TOKEN_USE:
            return None
        return payload
    except jwt.PyJWTError:
        return None

# Creates a JWT refresh token for a user. Used to obtain new access tokens without re-authenticating.
def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    return _create_token(
        data=data,
        token_use=REFRESH_TOKEN_USE,
        secret_key=settings.REFRESH_SECRET_KEY,
        expires_delta=expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )

# Decodes and verifies a JWT refresh token. Returns the payload if valid, otherwise None.
def decode_refresh_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.REFRESH_SECRET_KEY,
            algorithms=[ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )
        if payload.get("token_use") != REFRESH_TOKEN_USE:
            return None
        return payload
    except jwt.PyJWTError:
        return None
