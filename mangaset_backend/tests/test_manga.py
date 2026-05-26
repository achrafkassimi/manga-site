"""Manga API tests: list, detail, search, popular/featured."""
import pytest

pytestmark = pytest.mark.integration


def test_manga_list_returns_results(api_client, manga):
    response = api_client.get("/api/v1/manga/")
    assert response.status_code == 200
    payload = response.data
    results = payload.get("results", payload)
    assert any(m.get("slug") == manga.slug for m in results)


def test_manga_detail_returns_manga(api_client, manga):
    response = api_client.get(f"/api/v1/manga/{manga.slug}/")
    assert response.status_code == 200
    assert response.data.get("slug") == manga.slug
    assert response.data.get("title") == manga.title


def test_manga_detail_404_for_unknown_slug(api_client, db):
    response = api_client.get("/api/v1/manga/this-does-not-exist/")
    assert response.status_code == 404


def test_manga_search_by_title(api_client, manga):
    response = api_client.get("/api/v1/search/", {"q": manga.title[:4]})
    assert response.status_code == 200
    results = response.data.get("results", response.data)
    assert any(m.get("slug") == manga.slug for m in results)


def test_popular_manga_endpoint(api_client, manga):
    response = api_client.get("/api/v1/manga/lists/popular/")
    assert response.status_code == 200


def test_featured_manga_endpoint(api_client, manga):
    response = api_client.get("/api/v1/manga/lists/featured/")
    assert response.status_code == 200


def test_latest_updates_endpoint(api_client, manga):
    response = api_client.get("/api/v1/manga/lists/latest/")
    assert response.status_code == 200


def test_genre_list_endpoint(api_client, genre):
    response = api_client.get("/api/v1/genres/")
    assert response.status_code == 200
    results = response.data.get("results", response.data)
    assert any(g.get("name") == genre.name for g in results)
