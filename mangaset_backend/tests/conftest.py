"""Shared pytest fixtures for the MangaSet backend test suite."""
from __future__ import annotations

import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.fixture
def api_client() -> APIClient:
    """Anonymous DRF test client."""
    return APIClient()


@pytest.fixture
def user_password() -> str:
    return "TestPassw0rd!"


@pytest.fixture
def user(db, user_password) -> User:
    """A regular authenticated user."""
    return User.objects.create_user(
        username="alice",
        email="alice@example.com",
        password=user_password,
        first_name="Alice",
        last_name="Liddell",
    )


@pytest.fixture
def auth_client(api_client, user, user_password) -> APIClient:
    """API client authenticated via JWT."""
    response = api_client.post(
        "/api/v1/auth/login/",
        {"username": user.username, "password": user_password},
        format="json",
    )
    # If the custom login endpoint differs, fall back to /token/
    if response.status_code != 200:
        response = api_client.post(
            "/api/v1/auth/token/",
            {"username": user.username, "password": user_password},
            format="json",
        )
    token = response.data.get("access") or response.data.get("tokens", {}).get("access")
    if token:
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return api_client


@pytest.fixture
def genre(db):
    from manga.models import Genre
    return Genre.objects.create(name="Action", description="High-octane action")


@pytest.fixture
def manga(db, genre):
    from manga.models import Manga
    m = Manga.objects.create(
        title="Test Manga",
        slug="test-manga",
        description="A manga used in tests.",
        author="Test Author",
        status="ongoing",
    )
    m.genres.add(genre)
    return m
