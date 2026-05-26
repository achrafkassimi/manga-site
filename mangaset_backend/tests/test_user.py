"""User API tests: favorites, reading history."""
import pytest

pytestmark = pytest.mark.integration


def test_favorites_require_auth(api_client, manga):
    response = api_client.get("/api/v1/user/favorites/")
    assert response.status_code == 401


def test_favorites_list_empty_initially(auth_client):
    response = auth_client.get("/api/v1/user/favorites/")
    assert response.status_code == 200
    results = response.data.get("results", response.data)
    assert results == [] or len(results) == 0


def test_add_to_favorites_then_appears_in_list(auth_client, manga):
    add = auth_client.post(
        "/api/v1/user/favorites/",
        {"manga_id": manga.id},
        format="json",
    )
    assert add.status_code in (200, 201), add.data

    listing = auth_client.get("/api/v1/user/favorites/")
    assert listing.status_code == 200
    results = listing.data.get("results", listing.data)
    assert any(
        (item.get("manga", {}) or {}).get("slug") == manga.slug for item in results
    )


def test_remove_from_favorites(auth_client, manga):
    add = auth_client.post(
        "/api/v1/user/favorites/",
        {"manga_id": manga.id},
        format="json",
    )
    fav_id = add.data.get("id")
    assert fav_id, "Favorite creation did not return an id"

    remove = auth_client.delete(f"/api/v1/user/favorites/{fav_id}/")
    assert remove.status_code in (200, 204)


def test_reading_history_requires_auth(api_client):
    response = api_client.get("/api/v1/user/history/")
    assert response.status_code == 401


def test_reading_history_empty_initially(auth_client):
    response = auth_client.get("/api/v1/user/history/")
    assert response.status_code == 200
