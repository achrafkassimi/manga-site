# manga/management/commands/load_sample_data.py
import random
from datetime import timedelta
from io import BytesIO

from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models.signals import post_save
from django.utils import timezone

from manga.models import (
    ActivityLog, Chapter, Genre, Manga, ReadingHistory, UserFavorite,
    UserProfile,
)


# ── Cover image generator (Pillow) ────────────────────────────────────────────
def _make_cover(color_hex: str, width=300, height=420):
    """Return a PNG file as bytes — solid colour rectangle."""
    try:
        from PIL import Image, ImageDraw
        r = int(color_hex[1:3], 16)
        g = int(color_hex[3:5], 16)
        b = int(color_hex[5:7], 16)
        img = Image.new("RGB", (width, height), (r, g, b))
        draw = ImageDraw.Draw(img)
        # Simple border
        draw.rectangle([10, 10, width - 10, height - 10], outline=(255, 255, 255), width=3)
        buf = BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()
    except ImportError:
        return None


# ── Data ──────────────────────────────────────────────────────────────────────
GENRES_DATA = [
    {"name": "Action",       "description": "Fast-paced fights and adventure",      "color_code": "#ff6b6b"},
    {"name": "Romance",      "description": "Love stories and relationships",        "color_code": "#ff8cc8"},
    {"name": "Comedy",       "description": "Funny and humorous stories",            "color_code": "#4ecdc4"},
    {"name": "Drama",        "description": "Emotional, character-driven stories",   "color_code": "#95e1d3"},
    {"name": "Fantasy",      "description": "Magic and supernatural elements",       "color_code": "#a8e6cf"},
    {"name": "Sci-Fi",       "description": "Science fiction and futuristic themes", "color_code": "#88d8b0"},
    {"name": "Horror",       "description": "Scary and suspenseful stories",         "color_code": "#2c3e50"},
    {"name": "Slice of Life","description": "Everyday realistic situations",         "color_code": "#f39c12"},
    {"name": "Sports",       "description": "Sports-themed stories",                 "color_code": "#e67e22"},
    {"name": "Mystery",      "description": "Detective and mystery stories",         "color_code": "#9b59b6"},
    {"name": "Adventure",    "description": "Exploration and quests",                "color_code": "#3498db"},
    {"name": "Supernatural", "description": "Demons, spirits, and paranormal",       "color_code": "#8e44ad"},
]

MANGA_DATA = [
    {
        "title": "Dragon Quest Chronicles",
        "description": "A young warrior destined to save the world embarks on an epic journey filled with magic, dragons, and unforgettable companions.",
        "author": "Akira Toriyama",
        "artist": "Akira Toriyama",
        "status": "ongoing",
        "publication_year": 2020,
        "average_rating": 8.7,
        "is_featured": True,
        "is_popular": True,
        "genres": ["Action", "Fantasy", "Adventure"],
        "chapters": 45,
        "cover_color": "#e74c3c",
    },
    {
        "title": "Tokyo Love Story",
        "description": "A heartwarming romance set in modern Tokyo, following young adults navigating love, career, and friendship.",
        "author": "Naoko Takeuchi",
        "artist": "Naoko Takeuchi",
        "status": "completed",
        "publication_year": 2018,
        "average_rating": 9.2,
        "is_featured": True,
        "is_popular": True,
        "genres": ["Romance", "Drama", "Slice of Life"],
        "chapters": 120,
        "cover_color": "#e91e63",
    },
    {
        "title": "Space Pirates Adventures",
        "description": "Captain Nova and her crew explore the galaxy, battle evil corporations, and uncover ancient alien mysteries.",
        "author": "Hiromu Arakawa",
        "artist": "Hiromu Arakawa",
        "status": "ongoing",
        "publication_year": 2021,
        "average_rating": 8.4,
        "is_featured": False,
        "is_popular": True,
        "genres": ["Sci-Fi", "Action", "Comedy"],
        "chapters": 28,
        "cover_color": "#1abc9c",
    },
    {
        "title": "High School Detective",
        "description": "A brilliant student solves crimes that baffle the police while trying to maintain a normal teenage life.",
        "author": "Gosho Aoyama",
        "artist": "Gosho Aoyama",
        "status": "ongoing",
        "publication_year": 2019,
        "average_rating": 8.9,
        "is_featured": True,
        "is_popular": False,
        "genres": ["Mystery", "Drama", "Slice of Life"],
        "chapters": 67,
        "cover_color": "#2c3e50",
    },
    {
        "title": "Championship Dreams",
        "description": "A talented but arrogant tennis player learns the value of teamwork while pursuing the national championship.",
        "author": "Takeshi Konomi",
        "artist": "Takeshi Konomi",
        "status": "ongoing",
        "publication_year": 2020,
        "average_rating": 8.1,
        "is_featured": False,
        "is_popular": True,
        "genres": ["Sports", "Drama", "Comedy"],
        "chapters": 89,
        "cover_color": "#27ae60",
    },
    {
        "title": "Demon Hunters Guild",
        "description": "A guild of elite hunters battles demons threatening the human world. Magic, betrayal, and brotherhood collide.",
        "author": "Koyoharu Gotouge",
        "artist": "Koyoharu Gotouge",
        "status": "ongoing",
        "publication_year": 2021,
        "average_rating": 9.0,
        "is_featured": True,
        "is_popular": True,
        "genres": ["Action", "Supernatural", "Fantasy"],
        "chapters": 55,
        "cover_color": "#8e44ad",
    },
    {
        "title": "Midnight Horror Stories",
        "description": "An anthology of chilling supernatural horror tales set in modern Japan. Each chapter is a standalone nightmare.",
        "author": "Junji Ito",
        "artist": "Junji Ito",
        "status": "completed",
        "publication_year": 2017,
        "average_rating": 9.5,
        "is_featured": True,
        "is_popular": True,
        "genres": ["Horror", "Supernatural", "Mystery"],
        "chapters": 30,
        "cover_color": "#1a1a2e",
    },
    {
        "title": "Campus Life Comedy",
        "description": "A hopeless romantic navigates the chaos of university life with his overly energetic friends. Pure comedy gold.",
        "author": "Ken Akamatsu",
        "artist": "Ken Akamatsu",
        "status": "ongoing",
        "publication_year": 2022,
        "average_rating": 7.8,
        "is_featured": False,
        "is_popular": False,
        "genres": ["Comedy", "Slice of Life", "Romance"],
        "chapters": 22,
        "cover_color": "#f39c12",
    },
    {
        "title": "Galactic Warriors",
        "description": "In the year 3000, humanity fights alien invaders across star systems. The last warrior holds the key to peace.",
        "author": "Yoshiyuki Tomino",
        "artist": "Yoshiyuki Tomino",
        "status": "hiatus",
        "publication_year": 2019,
        "average_rating": 8.3,
        "is_featured": False,
        "is_popular": False,
        "genres": ["Sci-Fi", "Action", "Drama"],
        "chapters": 38,
        "cover_color": "#2980b9",
    },
    {
        "title": "Samurai of the East",
        "description": "A masterless samurai wanders feudal Japan seeking redemption for a terrible past crime. Beautiful and melancholic.",
        "author": "Hiroshi Hirata",
        "artist": "Hiroshi Hirata",
        "status": "completed",
        "publication_year": 2016,
        "average_rating": 9.1,
        "is_featured": True,
        "is_popular": True,
        "genres": ["Action", "Drama", "Adventure"],
        "chapters": 80,
        "cover_color": "#c0392b",
    },
    {
        "title": "Little Witch Academy",
        "description": "A non-magical girl enrolls in a prestigious witch school and must work twice as hard to prove herself.",
        "author": "Yoh Yoshinari",
        "artist": "Yoh Yoshinari",
        "status": "completed",
        "publication_year": 2018,
        "average_rating": 8.6,
        "is_featured": False,
        "is_popular": True,
        "genres": ["Fantasy", "Comedy", "Slice of Life"],
        "chapters": 48,
        "cover_color": "#9b59b6",
    },
    {
        "title": "Boxing Champion",
        "description": "From the streets to the world championship — the raw and gritty story of a boxer who never gives up.",
        "author": "Ikki Kajiwara",
        "artist": "Ikki Kajiwara",
        "status": "ongoing",
        "publication_year": 2021,
        "average_rating": 8.8,
        "is_featured": False,
        "is_popular": True,
        "genres": ["Sports", "Drama", "Action"],
        "chapters": 60,
        "cover_color": "#e67e22",
    },
]

USERS_DATA = [
    {"username": "john_doe",     "email": "john@example.com",   "first_name": "John",  "last_name": "Doe"},
    {"username": "jane_smith",   "email": "jane@example.com",   "first_name": "Jane",  "last_name": "Smith"},
    {"username": "otaku_master", "email": "otaku@example.com",  "first_name": "Alex",  "last_name": "Johnson"},
    {"username": "manga_lover",  "email": "lover@example.com",  "first_name": "Sarah", "last_name": "Wilson"},
    {"username": "reader_pro",   "email": "reader@example.com", "first_name": "Mike",  "last_name": "Brown"},
]


class Command(BaseCommand):
    help = "Load sample manga data for development (genres, manga, chapters, users)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before loading",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            ReadingHistory.objects.all().delete()
            UserFavorite.objects.all().delete()
            UserProfile.objects.filter(user__is_superuser=False).delete()
            Chapter.objects.all().delete()
            Manga.objects.all().delete()
            Genre.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            ActivityLog.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Cleared!"))

        self._disconnect_signals()
        try:
            with transaction.atomic():
                genres   = self._create_genres()
                users    = self._create_users()
                mangas   = self._create_manga(genres)
                self._create_user_activity(users, mangas)
        finally:
            self._reconnect_signals()

        self._print_summary()

    # ── Steps ─────────────────────────────────────────────────────────────────

    def _create_genres(self):
        genres = {}
        for g in GENRES_DATA:
            obj, created = Genre.objects.get_or_create(name=g["name"], defaults=g)
            genres[g["name"]] = obj
            if created:
                self.stdout.write(f"  + Genre: {obj.name}")
        return genres

    def _create_users(self):
        users = {}
        for data in USERS_DATA:
            if User.objects.filter(username=data["username"]).exists():
                user = User.objects.get(username=data["username"])
            else:
                user = User(
                    username=data["username"],
                    email=data["email"],
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    is_active=True,
                )
                user.set_password("password123")
                user.save()
                UserProfile.objects.create(
                    user=user,
                    bio=f"Hi! I'm {user.first_name}, a manga enthusiast.",
                    reading_preferences={"dark_mode": random.choice([True, False])},
                )
                self.stdout.write(f"  + User: {user.username}")
            users[user.username] = user
        return users

    def _create_manga(self, genres):
        manga_objects = []
        for data in MANGA_DATA:
            manga, created = Manga.objects.get_or_create(
                title=data["title"],
                defaults={
                    "description":       data["description"],
                    "author":            data["author"],
                    "artist":            data["artist"],
                    "status":            data["status"],
                    "publication_year":  data["publication_year"],
                    "average_rating":    data["average_rating"],
                    "is_featured":       data["is_featured"],
                    "is_popular":        data["is_popular"],
                    "total_chapters":    data["chapters"],
                    "view_count":        random.randint(5_000, 150_000),
                },
            )

            if created:
                # Cover image (coloured PNG via Pillow)
                png = _make_cover(data["cover_color"])
                if png:
                    manga.cover_image.save(
                        f"{manga.slug}.png",
                        ContentFile(png),
                        save=True,
                    )

                # Genres (set through MangaGenre)
                genre_objs = [genres[n] for n in data["genres"] if n in genres]
                manga.genres.set(genre_objs)

                # Chapters (first 10 max)
                num_chapters = min(10, data["chapters"])
                for i in range(1, num_chapters + 1):
                    Chapter.objects.create(
                        manga=manga,
                        chapter_number=i,
                        title=f"Chapter {i}" + (" — The Beginning" if i == 1 else ""),
                        pages=[
                            f"manga/{manga.slug}/ch{i}/page_{p}.jpg"
                            for p in range(1, random.randint(16, 25))
                        ],
                        page_count=random.randint(16, 24),
                        is_published=True,
                        view_count=random.randint(200, 8_000),
                    )

                self.stdout.write(f"  + Manga: {manga.title} ({num_chapters} chapters)")

            manga_objects.append(manga)
        return manga_objects

    def _create_user_activity(self, users, mangas):
        if not mangas:
            return
        for user in users.values():
            # Favorites (2–4 manga)
            for manga in random.sample(mangas, min(random.randint(2, 4), len(mangas))):
                UserFavorite.objects.get_or_create(
                    user=user,
                    manga=manga,
                    defaults={"added_at": timezone.now() - timedelta(days=random.randint(1, 90))},
                )

            # Reading history (3–5 manga)
            for manga in random.sample(mangas, min(random.randint(3, 5), len(mangas))):
                chapters = list(manga.chapters.all())
                if not chapters:
                    continue
                ch = random.choice(chapters)
                ReadingHistory.objects.get_or_create(
                    user=user,
                    manga=manga,
                    defaults={
                        "chapter":             ch,
                        "last_page":           random.randint(0, ch.page_count),
                        "progress_percentage": random.randint(10, 100),
                        "first_read_at":       timezone.now() - timedelta(days=random.randint(10, 60)),
                        "last_read_at":        timezone.now() - timedelta(days=random.randint(0, 10)),
                    },
                )

    # ── Signals ───────────────────────────────────────────────────────────────

    def _disconnect_signals(self):
        try:
            from manga.models import signals
            post_save.disconnect(signals.log_user_registration, sender=User)
            post_save.disconnect(signals.create_user_profile,   sender=User)
            post_save.disconnect(signals.save_user_profile,     sender=User)
        except (ImportError, AttributeError):
            pass

    def _reconnect_signals(self):
        try:
            from manga.models import signals
            post_save.connect(signals.log_user_registration, sender=User)
            post_save.connect(signals.create_user_profile,   sender=User)
            post_save.connect(signals.save_user_profile,     sender=User)
        except (ImportError, AttributeError):
            pass

    # ── Summary ───────────────────────────────────────────────────────────────

    def _print_summary(self):
        self.stdout.write(self.style.SUCCESS("\n========================================"))
        self.stdout.write(self.style.SUCCESS("  SAMPLE DATA LOADED"))
        self.stdout.write(self.style.SUCCESS("========================================"))
        self.stdout.write(f"  Genres   : {Genre.objects.count()}")
        self.stdout.write(f"  Manga    : {Manga.objects.count()}")
        self.stdout.write(f"  Chapters : {Chapter.objects.count()}")
        self.stdout.write(f"  Users    : {User.objects.filter(is_superuser=False).count()}")
        self.stdout.write(f"  Favorites: {UserFavorite.objects.count()}")
        self.stdout.write(f"  History  : {ReadingHistory.objects.count()}")
        self.stdout.write(self.style.SUCCESS("\n  All users password: password123"))
        self.stdout.write(self.style.SUCCESS("  Admin panel : http://localhost:8000/admin/"))
        self.stdout.write(self.style.SUCCESS("  API manga   : http://localhost:8000/api/v1/manga/"))
        self.stdout.write(self.style.SUCCESS("  Featured    : http://localhost:8000/api/v1/manga/lists/featured/"))
        self.stdout.write(self.style.SUCCESS("========================================\n"))
