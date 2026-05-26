# manga/serializers.py
#
# DEPRECATED: All serializers have moved to `api/serializers.py` as the single
# source of truth. The previous classes here used a stale `rating` field that
# no longer exists on the Manga model (renamed to `average_rating`), which was
# causing silent data bugs.
#
# Import from `api.serializers` instead:
#     from api.serializers import (
#         MangaListSerializer, MangaDetailSerializer, ChapterListSerializer,
#         ChapterDetailSerializer, GenreSerializer, UserFavoriteSerializer,
#         ReadingHistorySerializer,
#     )