"""
Integration tests for authentication endpoints.
"""
from datetime import datetime, timedelta, timezone
from fastapi import status
from unittest.mock import patch
from app.auth.models.user import Activity, BlocklistItem
from app.auth.schemas.user import UserCreate
from app.crud.data import create_blocklist_item
from app.crud.user import create_oauth_user, create_user, get_user_by_email
from app.utils.jwt import create_access_token, create_refresh_token

class TestAuthEndpoints:
    """Test authentication API endpoints."""

    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"status": "ok"}

    @patch('app.main.send_verification_email')
    def test_user_signup_success(self, mock_send_email, client, test_user_data):
        """Test successful user signup."""
        mock_send_email.return_value = True

        response = client.post("/auth/signup", json=test_user_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["user"]["email"] == test_user_data["email"]
        assert "id" in data["user"]
        assert "password" not in data["user"]  # Password should not be returned
        assert data["email_sent"] is True
        assert "successfully" in data["message"]

        # Verify email was sent
        mock_send_email.assert_called_once()

    @patch('app.main.send_verification_email')
    def test_user_signup_email_failure(self, mock_send_email, client, test_user_data):
        """Test user signup when email sending fails."""
        mock_send_email.return_value = False

        response = client.post("/auth/signup", json=test_user_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["user"]["email"] == test_user_data["email"]
        assert "id" in data["user"]
        assert data["email_sent"] is False
        assert "couldn't send" in data["message"]
        assert "resend" in data["message"]

        # Verify email was attempted
        mock_send_email.assert_called_once()

    def test_user_signup_duplicate_email(self, client, test_user_data):
        """Test signup with existing email."""
        # First signup
        with patch('app.main.send_verification_email') as mock_send_email:
            mock_send_email.return_value = True
            response = client.post("/auth/signup", json=test_user_data)
            assert response.status_code == status.HTTP_200_OK

        # Second signup with same email
        with patch('app.main.send_verification_email') as mock_send_email:
            mock_send_email.return_value = True
            response = client.post("/auth/signup", json=test_user_data)
            assert response.status_code == status.HTTP_400_BAD_REQUEST
            assert "Email already registered" in response.json()["detail"]

    def test_user_signup_invalid_email(self, client):
        """Test signup with invalid email format."""
        invalid_user_data = {
            "email": "invalid-email",
            "password": "password123"
        }

        response = client.post("/auth/signup", json=invalid_user_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_user_login_unverified(self, client, test_user_data):
        """Test login with unverified email."""
        # Create user
        with patch('app.main.send_verification_email') as mock_send_email:
            mock_send_email.return_value = True
            client.post("/auth/signup", json=test_user_data)

        # Try to login
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        with patch('app.main.send_verification_email') as mock_send_email:
            mock_send_email.return_value = True
            response = client.post("/auth/login", data=login_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "Please verify your email" in data["message"]
        assert data["email_sent"] is True
        assert "verification_url" in data
        assert "access_token" not in data
        assert "refresh_token" not in data

    def test_user_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        login_data = {
            "username": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        response = client.post("/auth/login", data=login_data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid credentials" in response.json()["detail"]

    def test_oauth_only_user_cannot_password_login(self, client, db_session):
        """Test OAuth-only users do not trigger password verification errors."""
        create_oauth_user(db_session, "oauth@example.com", "OAuth User")

        response = client.post("/auth/login", data={
            "username": "oauth@example.com",
            "password": "password123",
        })

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid credentials" in response.json()["detail"]

    def test_refresh_token_cannot_access_protected_endpoint(self, client, db_session):
        """Test refresh tokens are rejected by bearer-protected endpoints."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()

        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        response = client.get("/me", headers={"Authorization": f"Bearer {refresh_token}"})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid token" in response.json()["detail"]

    def test_access_token_cannot_refresh(self, client):
        """Test access tokens are rejected by the refresh endpoint."""
        access_token = create_access_token(data={"sub": "1"})
        response = client.post("/auth/refresh", json={"refresh_token": access_token})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid refresh token" in response.json()["detail"]

    def test_malformed_access_token_subjects_are_rejected(self, client, db_session):
        """Test missing and non-integer sub claims fail without server errors."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()

        missing_sub = create_access_token(data={})
        non_integer_sub = create_access_token(data={"sub": "not-an-int"})

        for token in (missing_sub, non_integer_sub):
            response = client.get("/me", headers={"Authorization": f"Bearer {token}"})
            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            assert "Invalid token payload" in response.json()["detail"]

    def test_refresh_fails_for_unverified_user(self, client, db_session):
        """Test refresh does not issue tokens for unverified users."""
        user = create_user(db_session, UserCreate(email="unverified@example.com", password="password123"))
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        response = client.post("/auth/refresh", json={"refresh_token": refresh_token})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid refresh token" in response.json()["detail"]

    def test_refresh_fails_for_deleted_user(self, client, db_session):
        """Test refresh does not issue tokens for deleted users."""
        user = create_user(db_session, UserCreate(email="deleted@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        db_session.delete(user)
        db_session.commit()

        response = client.post("/auth/refresh", json={"refresh_token": refresh_token})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Invalid refresh token" in response.json()["detail"]

    def test_blocklist_check_query_and_path_routes_match(self, client, db_session):
        """Test canonical query route and legacy path route behave identically."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()
        create_blocklist_item(db_session, user.id, "example.com")
        access_token = create_access_token(data={"sub": str(user.id)})
        headers = {"Authorization": f"Bearer {access_token}"}

        query_response = client.get("/api/blocklist/check?website=example.com", headers=headers)
        path_response = client.get("/api/blocklist/check/example.com", headers=headers)

        assert query_response.status_code == status.HTTP_200_OK
        assert path_response.status_code == status.HTTP_200_OK
        assert query_response.json() == path_response.json()

    def test_activity_stats_route_is_not_shadowed_by_activity_id(self, client, db_session):
        """Test /api/activity/stats is handled as a static route."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()
        access_token = create_access_token(data={"sub": str(user.id)})

        response = client.get("/api/activity/stats", headers={"Authorization": f"Bearer {access_token}"})

        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"total": 0, "solved": 0, "attempted": 0}

    def test_activity_create_accepts_legacy_status_and_normalizes_url(self, client, db_session):
        """Test activity creation maps legacy status values and canonicalizes LeetCode URLs."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()
        access_token = create_access_token(data={"sub": str(user.id)})
        headers = {"Authorization": f"Bearer {access_token}"}

        response = client.post(
            "/api/activity",
            headers=headers,
            json={
                "problem_name": "Two Sum",
                "problem_url": "https://leetcode.com/problems/two-sum/?envType=study-plan",
                "difficulty": "Easy",
                "topic_tags": ["Array", "Hash Table"],
                "status": "completed",
            },
        )

        assert response.status_code == status.HTTP_200_OK
        activity = db_session.query(Activity).filter(Activity.user_id == user.id).one()
        assert activity.problem_url == "https://leetcode.com/problems/two-sum/"
        assert activity.status == "solved"

        stats_response = client.get("/api/activity/stats", headers=headers)
        assert stats_response.status_code == status.HTTP_200_OK
        assert stats_response.json() == {"total": 1, "solved": 1, "attempted": 0}

    def test_activity_create_updates_duplicate_problem_instead_of_inserting(self, client, db_session):
        """Test duplicate problem URLs update the existing user activity."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()
        access_token = create_access_token(data={"sub": str(user.id)})
        headers = {"Authorization": f"Bearer {access_token}"}

        first_response = client.post(
            "/api/activity",
            headers=headers,
            json={
                "problem_name": "Two Sum",
                "problem_url": "https://leetcode.com/problems/two-sum/",
                "difficulty": "Easy",
                "topic_tags": ["Array"],
                "status": "solved",
            },
        )
        second_response = client.post(
            "/api/activity",
            headers=headers,
            json={
                "problem_name": "Two Sum",
                "problem_url": "https://leetcode.com/problems/two-sum/description/",
                "difficulty": "Easy",
                "topic_tags": ["Array"],
                "status": "in_progress",
            },
        )

        assert first_response.status_code == status.HTTP_200_OK
        assert second_response.status_code == status.HTTP_200_OK
        assert second_response.json()["message"] == "Activity updated"
        assert second_response.json()["activity_id"] == first_response.json()["activity_id"]
        activities = db_session.query(Activity).filter(Activity.user_id == user.id).all()
        assert len(activities) == 1
        assert activities[0].status == "attempted"

    def test_blocklist_normalizes_domains_and_blocks_duplicates(self, client, db_session):
        """Test blocklist add/check/remove all use canonical domains."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()
        access_token = create_access_token(data={"sub": str(user.id)})
        headers = {"Authorization": f"Bearer {access_token}"}

        add_response = client.post(
            "/api/blocklist/add",
            headers=headers,
            json={"website": "https://www.YouTube.com/watch?v=123"},
        )
        duplicate_response = client.post(
            "/api/blocklist/add",
            headers=headers,
            json={"website": "youtube.com"},
        )
        check_response = client.get(
            "/api/blocklist/check?website=https%3A%2F%2Fwww.youtube.com%2Fshorts%2Fabc",
            headers=headers,
        )
        list_response = client.get("/api/blocklist", headers=headers)
        remove_response = client.request(
            "DELETE",
            "/api/blocklist/remove",
            headers=headers,
            json={"website": "https://youtube.com/feed/subscriptions"},
        )

        assert add_response.status_code == status.HTTP_200_OK
        assert add_response.json()["website"] == "youtube.com"
        assert duplicate_response.status_code == status.HTTP_400_BAD_REQUEST
        assert check_response.status_code == status.HTTP_200_OK
        assert check_response.json() == {"website": "youtube.com", "is_blocked": True}
        assert list_response.json() == {"websites": ["youtube.com"]}
        assert remove_response.status_code == status.HTTP_200_OK
        assert db_session.query(BlocklistItem).filter(BlocklistItem.user_id == user.id).count() == 0

    def test_goal_progress_is_independent_from_activity_history(self, client, db_session):
        """Test progress increments do not require activity rows."""
        user = create_user(db_session, UserCreate(email="verified@example.com", password="password123"))
        user.is_verified = True
        db_session.commit()
        access_token = create_access_token(data={"sub": str(user.id)})

        response = client.post(
            "/api/me/goal/progress",
            headers={"Authorization": f"Bearer {access_token}"},
            json={"delta": 1},
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["progress_today"] == 1
        assert db_session.query(Activity).filter(Activity.user_id == user.id).count() == 0

    @patch('app.main.send_verification_email')
    @patch('app.main.send_welcome_email')
    def test_email_verification_success(self, mock_welcome_email, mock_verification_email, client, db_session, test_user_data):
        """Test successful email verification."""
        mock_verification_email.return_value = True
        mock_welcome_email.return_value = True

        # Create user
        response = client.post("/auth/signup", json=test_user_data)
        assert response.status_code == status.HTTP_200_OK

        # Get verification code from the created user
        user = get_user_by_email(db_session, test_user_data["email"])

        # Verify email
        verification_data = {
            "email": test_user_data["email"],
            "code": user.verification_code
        }
        response = client.post("/auth/verify-email-code", json=verification_data)

        assert response.status_code == status.HTTP_200_OK
        assert "Email verified successfully" in response.json()["message"]

        # Verify welcome email was sent
        mock_welcome_email.assert_called_once()

    @patch('app.main.send_verification_email')
    def test_email_verification_invalid_code(self, mock_send_email, client, test_user_data):
        """Test email verification with invalid code."""
        mock_send_email.return_value = True

        # Create user
        response = client.post("/auth/signup", json=test_user_data)
        assert response.status_code == status.HTTP_200_OK

        # Try to verify with wrong code
        verification_data = {
            "email": test_user_data["email"],
            "code": "000000"
        }
        response = client.post("/auth/verify-email-code", json=verification_data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid or expired verification code" in response.json()["detail"]

    @patch('app.main.send_verification_email')
    def test_resend_verification_code(self, mock_send_email, client, db_session, test_user_data):
        """Test resending verification code."""
        mock_send_email.return_value = True

        # Create user
        response = client.post("/auth/signup", json=test_user_data)
        assert response.status_code == status.HTTP_200_OK
        user = get_user_by_email(db_session, test_user_data["email"])
        user.last_code_sent_at = datetime.now(timezone.utc) - timedelta(seconds=31)
        db_session.commit()

        # Resend verification code
        resend_data = {
            "email": test_user_data["email"],
            "code": "000000"  # Code doesn't matter for resend
        }
        response = client.post("/auth/resend-verification-code", json=resend_data)

        assert response.status_code == status.HTTP_200_OK
        assert "Verification code resent successfully" in response.json()["message"]

        # Verify email was sent again
        assert mock_send_email.call_count == 2  # Once for signup, once for resend

    @patch('app.main.send_verification_email')
    def test_resend_verification_code_failure(self, mock_send_email, client, db_session, test_user_data):
        """Test resending verification code when email fails."""
        # First call succeeds (signup), second call fails (resend)
        mock_send_email.side_effect = [True, False]

        # Create user
        response = client.post("/auth/signup", json=test_user_data)
        assert response.status_code == status.HTTP_200_OK
        user = get_user_by_email(db_session, test_user_data["email"])
        user.last_code_sent_at = datetime.now(timezone.utc) - timedelta(seconds=31)
        db_session.commit()

        # Try to resend verification code
        resend_data = {
            "email": test_user_data["email"],
            "code": "000000"
        }
        response = client.post("/auth/resend-verification-code", json=resend_data)

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert "Failed to send verification email" in response.json()["detail"]

    @patch('app.main.send_verification_email')
    @patch('app.main.send_welcome_email')
    def test_complete_auth_flow(self, mock_welcome_email, mock_verification_email, client, db_session, test_user_data):
        """Test complete authentication flow: signup -> verify -> login."""
        mock_verification_email.return_value = True
        mock_welcome_email.return_value = True

        # 1. Signup
        response = client.post("/auth/signup", json=test_user_data)
        assert response.status_code == status.HTTP_200_OK

        # 2. Get verification code
        user = get_user_by_email(db_session, test_user_data["email"])

        # 3. Verify email
        verification_data = {
            "email": test_user_data["email"],
            "code": user.verification_code
        }
        response = client.post("/auth/verify-email-code", json=verification_data)
        assert response.status_code == status.HTTP_200_OK

        # 4. Login
        login_data = {
            "username": test_user_data["email"],
            "password": test_user_data["password"]
        }
        response = client.post("/auth/login", data=login_data)

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
