"""Auth API tests: register, login, token refresh, profile."""
import pytest

pytestmark = pytest.mark.integration


def test_register_creates_user(api_client, db):
    payload = {
        "username": "bob",
        "email": "bob@example.com",
        "password": "StrongPassw0rd!",
        "password_confirm": "StrongPassw0rd!",
        "first_name": "Bob",
        "last_name": "Smith",
    }
    response = api_client.post("/api/v1/auth/register/", payload, format="json")
    assert response.status_code in (200, 201), response.data


def test_login_returns_jwt(api_client, user, user_password):
    response = api_client.post(
        "/api/v1/auth/login/",
        {"username": user.username, "password": user_password},
        format="json",
    )
    assert response.status_code == 200, response.data
    # Either {access, refresh, user} or {tokens: {access, refresh}, user}
    has_access = "access" in response.data or "access" in response.data.get("tokens", {})
    assert has_access


def test_token_refresh(api_client, user, user_password):
    login = api_client.post(
        "/api/v1/auth/login/",
        {"username": user.username, "password": user_password},
        format="json",
    )
    refresh = login.data.get("refresh") or login.data.get("tokens", {}).get("refresh")
    assert refresh, "Login did not return a refresh token"

    response = api_client.post(
        "/api/v1/auth/token/refresh/",
        {"refresh": refresh},
        format="json",
    )
    assert response.status_code == 200
    assert "access" in response.data


def test_profile_requires_auth(api_client):
    response = api_client.get("/api/v1/auth/profile/")
    assert response.status_code == 401


def test_profile_returns_current_user(auth_client, user):
    response = auth_client.get("/api/v1/auth/profile/")
    assert response.status_code == 200
    assert response.data.get("username") == user.username
