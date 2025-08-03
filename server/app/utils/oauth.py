import httpx
import json
from typing import Optional, Dict, Any
from app.config import settings

async def get_google_user_info(access_token: str) -> Optional[Dict[str, Any]]:
    """Get user info from Google using access token"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return response.json()
    return None

async def get_github_user_info(access_token: str) -> Optional[Dict[str, Any]]:
    """Get user info from GitHub using access token"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        if response.status_code == 200:
            user_data = response.json()
            # Get email from GitHub
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json"
                }
            )
            if email_response.status_code == 200:
                emails = email_response.json()
                primary_email = next((email for email in emails if email.get("primary")), None)
                if primary_email:
                    user_data["email"] = primary_email["email"]
            return user_data
    return None

async def exchange_google_code(code: str, redirect_uri: str) -> Optional[str]:
    """Exchange authorization code for Google access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri
            }
        )
        if response.status_code == 200:
            token_data = response.json()
            return token_data.get("access_token")
    return None

async def exchange_github_code(code: str, redirect_uri: str) -> Optional[str]:
    """Exchange authorization code for GitHub access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": redirect_uri
            },
            headers={"Accept": "application/json"}
        )
        if response.status_code == 200:
            token_data = response.json()
            return token_data.get("access_token")
    return None 