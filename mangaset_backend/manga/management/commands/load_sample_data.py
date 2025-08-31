# manga/management/commands/load_sample_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import transaction
from django.db.models.signals import post_save, pre_delete, post_delete
from datetime import timedelta
import random

# Import your models
from manga.models import (
    Genre, Manga, Chapter, UserProfile, UserFavorite, ReadingHistory,
    ActivityLog
)

class Command(BaseCommand):
    help = 'Load comprehensive sample data for development and testing'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before loading new data',
        )
    
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            # Clear in reverse order to avoid foreign key constraints
            ReadingHistory.objects.all().delete()
            UserFavorite.objects.all().delete()
            UserProfile.objects.all().delete()
            Chapter.objects.all().delete()
            Manga.objects.all().delete()
            Genre.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            ActivityLog.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Data cleared!'))
        
        self.stdout.write('Loading sample data...')
        
        # Temporarily disconnect signals to prevent ActivityLog errors
        self._disconnect_signals()
        
        try:
            with transaction.atomic():
                self._load_data()
        finally:
            # Reconnect signals
            self._reconnect_signals()
        
        # Now create some activity logs manually with proper user_agent
        self._create_sample_activity_logs()
        
        # Summary
        stats = {
            'Users': User.objects.filter(is_superuser=False).count(),
            'Genres': Genre.objects.count(),
            'Manga': Manga.objects.count(),
            'Chapters': Chapter.objects.count(),
            'User Favorites': UserFavorite.objects.count(),
            'Reading History': ReadingHistory.objects.count(),
            'Activity Logs': ActivityLog.objects.count(),
        }
        
        self.stdout.write(self.style.SUCCESS('\n=== SAMPLE DATA LOADED SUCCESSFULLY ==='))
        for item, count in stats.items():
            self.stdout.write(f'{item}: {count}')
        
        self.stdout.write(self.style.SUCCESS('\n=== TEST USER CREDENTIALS ==='))
        self.stdout.write('All test users have password: password123')
        users = ['john_doe', 'jane_smith', 'otaku_master', 'manga_lover', 'reader_pro']
        for username in users:
            self.stdout.write(f'Username: {username} | Password: password123')
        
        self.stdout.write(self.style.SUCCESS('\n=== API TESTING URLS ==='))
        self.stdout.write('http://localhost:8000/api/v1/manga/ - List all manga')
        self.stdout.write('http://localhost:8000/api/v1/manga/lists/featured/ - Featured manga')
        self.stdout.write('http://localhost:8000/api/v1/manga/lists/popular/ - Popular manga')
        self.stdout.write('http://localhost:8000/api/v1/genres/ - List all genres')
        self.stdout.write('http://localhost:8000/api/auth/login/ - User login')
        self.stdout.write('http://localhost:8000/admin/ - Admin panel')
    
    def _disconnect_signals(self):
        """Disconnect problematic signals"""
        try:
            from manga.models import signals
            # Disconnect the user registration signal that's causing issues
            post_save.disconnect(signals.log_user_registration, sender=User)
            post_save.disconnect(signals.create_user_profile, sender=User)
            post_save.disconnect(signals.save_user_profile, sender=User)
            self.stdout.write('Signals disconnected temporarily')
        except (ImportError, AttributeError) as e:
            self.stdout.write(f'Could not disconnect some signals: {e}')
    
    def _reconnect_signals(self):
        """Reconnect signals"""
        try:
            from manga.models import signals
            post_save.connect(signals.log_user_registration, sender=User)
            post_save.connect(signals.create_user_profile, sender=User)
            post_save.connect(signals.save_user_profile, sender=User)
            self.stdout.write('Signals reconnected')
        except (ImportError, AttributeError) as e:
            self.stdout.write(f'Could not reconnect some signals: {e}')
    
    def _load_data(self):
        # Create Genres
        genres_data = [
            {'name': 'Action', 'description': 'Fast-paced stories with fighting and adventure', 'color_code': '#ff6b6b'},
            {'name': 'Romance', 'description': 'Love stories and romantic relationships', 'color_code': '#ff8cc8'},
            {'name': 'Comedy', 'description': 'Funny and humorous stories', 'color_code': '#4ecdc4'},
            {'name': 'Drama', 'description': 'Emotional and character-driven stories', 'color_code': '#95e1d3'},
            {'name': 'Fantasy', 'description': 'Stories with magic and supernatural elements', 'color_code': '#a8e6cf'},
            {'name': 'Sci-Fi', 'description': 'Science fiction and futuristic themes', 'color_code': '#88d8b0'},
            {'name': 'Horror', 'description': 'Scary and suspenseful stories', 'color_code': '#2c3e50'},
            {'name': 'Slice of Life', 'description': 'Everyday life and realistic situations', 'color_code': '#f39c12'},
            {'name': 'Sports', 'description': 'Sports-themed stories', 'color_code': '#e67e22'},
            {'name': 'Mystery', 'description': 'Detective and mystery stories', 'color_code': '#9b59b6'},
        ]
        
        genres = {}
        for genre_data in genres_data:
            genre, created = Genre.objects.get_or_create(
                name=genre_data['name'],
                defaults=genre_data
            )
            genres[genre.name] = genre
            if created:
                self.stdout.write(f'Created genre: {genre.name}')
        
        # Create Users manually (without triggering signals)
        users_data = [
            {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
            {'username': 'otaku_master', 'email': 'otaku@example.com', 'first_name': 'Alex', 'last_name': 'Johnson'},
            {'username': 'manga_lover', 'email': 'lover@example.com', 'first_name': 'Sarah', 'last_name': 'Wilson'},
            {'username': 'reader_pro', 'email': 'reader@example.com', 'first_name': 'Mike', 'last_name': 'Brown'},
        ]
        
        users = {}
        for user_data in users_data:
            if User.objects.filter(username=user_data['username']).exists():
                user = User.objects.get(username=user_data['username'])
                self.stdout.write(f'User already exists: {user.username}')
            else:
                user = User(
                    username=user_data['username'],
                    email=user_data['email'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    is_active=True,
                )
                user.set_password('password123')
                user.save()
                
                # Create UserProfile manually
                UserProfile.objects.create(
                    user=user,
                    bio=f"Hi! I'm {user.first_name}, a manga enthusiast who loves reading various genres.",
                    reading_preferences={
                        'reading_mode': 'single_page',
                        'dark_mode': random.choice([True, False]),
                        'auto_bookmark': True,
                    }
                )
                
                self.stdout.write(f'Created user: {user.username}')
                
            users[user.username] = user
        
        # Create Manga - FIXED: Use average_rating instead of rating
        manga_data = [
            {
                'title': 'Dragon Quest Chronicles',
                'description': 'Follow the epic journey of a young warrior destined to save the world from an ancient evil. Filled with magic, dragons, and unforgettable characters.',
                'author': 'Akira Toriyama',
                'artist': 'Akira Toriyama',
                'status': 'ongoing',
                'publication_year': 2020,
                'average_rating': 8.7,
                'is_featured': True,
                'genres': ['Action', 'Fantasy', 'Drama'],
                'chapters': 45,
            },
            {
                'title': 'Tokyo Love Story',
                'description': 'A heartwarming romance set in modern Tokyo, following the lives of young adults navigating love, career, and friendship.',
                'author': 'Naoko Takeuchi',
                'artist': 'Naoko Takeuchi',
                'status': 'completed',
                'publication_year': 2018,
                'average_rating': 9.2,
                'is_featured': True,
                'genres': ['Romance', 'Drama', 'Slice of Life'],
                'chapters': 120,
            },
            {
                'title': 'Space Pirates Adventures',
                'description': 'Join Captain Nova and her crew as they explore the galaxy, battle evil corporations, and uncover ancient mysteries.',
                'author': 'Hiromu Arakawa',
                'artist': 'Hiromu Arakawa',
                'status': 'ongoing',
                'publication_year': 2021,
                'average_rating': 8.4,
                'is_featured': False,
                'genres': ['Sci-Fi', 'Action', 'Comedy'],
                'chapters': 28,
            },
            {
                'title': 'High School Detective',
                'description': 'A brilliant high school student solves crimes that baffle the police, while trying to maintain a normal teenage life.',
                'author': 'Gosho Aoyama',
                'artist': 'Gosho Aoyama',
                'status': 'ongoing',
                'publication_year': 2019,
                'average_rating': 8.9,
                'is_featured': True,
                'genres': ['Mystery', 'Drama', 'Slice of Life'],
                'chapters': 67,
            },
            {
                'title': 'Championship Dreams',
                'description': 'A talented but arrogant tennis player learns the value of teamwork and friendship while pursuing the national championship.',
                'author': 'Takeshi Konomi',
                'artist': 'Takeshi Konomi',
                'status': 'ongoing',
                'publication_year': 2020,
                'average_rating': 8.1,
                'is_featured': False,
                'genres': ['Sports', 'Drama', 'Comedy'],
                'chapters': 89,
            },
        ]
        
        manga_objects = []
        for manga_info in manga_data:
            manga, created = Manga.objects.get_or_create(
                title=manga_info['title'],
                defaults={
                    'description': manga_info['description'],
                    'author': manga_info['author'],
                    'artist': manga_info['artist'],
                    'status': manga_info['status'],
                    'publication_year': manga_info['publication_year'],
                    'average_rating': manga_info['average_rating'],  # FIXED: Use average_rating
                    'is_featured': manga_info['is_featured'],
                    'total_chapters': manga_info['chapters'],
                    'view_count': random.randint(1000, 50000),
                }
            )
            
            if created:
                # Add genres - Using the through table if it exists
                try:
                    # If using MangaGenre through table
                    manga_genres = [genres[genre_name] for genre_name in manga_info['genres'] if genre_name in genres]
                    manga.genres.set(manga_genres)
                except Exception as e:
                    self.stdout.write(f'Genre assignment error for {manga.title}: {e}')
                
                # Create chapters for each manga - Use 'pages' instead of 'images'
                for i in range(1, min(11, manga_info['chapters'] + 1)):  # Create first 10 chapters
                    Chapter.objects.create(
                        manga=manga,
                        chapter_number=i,
                        title=f"Chapter {i}: {'The Beginning' if i == 1 else f'Part {i}'}",
                        pages=[  # FIXED: Use 'pages' instead of 'images'
                            f"manga/{manga.slug}/chapter_{i}/page_{j}.jpg" 
                            for j in range(1, random.randint(15, 25))
                        ],
                        page_count=random.randint(15, 24),
                        is_published=True,
                        view_count=random.randint(100, 5000),
                    )
                
                manga_objects.append(manga)
                self.stdout.write(f'Created manga: {manga.title} with chapters')
            else:
                manga_objects.append(manga)
        
        # Create User Favorites and Reading History
        for username, user in users.items():
            # Add random favorites (2-3 manga per user)
            favorite_count = min(random.randint(2, 3), len(manga_objects))
            if manga_objects:
                favorite_manga = random.sample(manga_objects, favorite_count)
                for manga in favorite_manga:
                    UserFavorite.objects.get_or_create(
                        user=user,
                        manga=manga,
                        defaults={'added_at': timezone.now() - timedelta(days=random.randint(1, 90))}
                    )
                
                # Add reading history (3-4 manga per user)
                history_count = min(random.randint(3, 4), len(manga_objects))
                read_manga = random.sample(manga_objects, history_count)
                for manga in read_manga:
                    chapters = list(manga.chapters.all())
                    if chapters:
                        random_chapter = random.choice(chapters)
                        ReadingHistory.objects.get_or_create(
                            user=user,
                            manga=manga,
                            defaults={
                                'chapter': random_chapter,
                                'last_page': random.randint(0, random_chapter.page_count),
                                'progress_percentage': random.randint(0, 100),
                                'first_read_at': timezone.now() - timedelta(days=random.randint(1, 60)),
                                'last_read_at': timezone.now() - timedelta(days=random.randint(0, 30)),
                            }
                        )
    
    def _create_sample_activity_logs(self):
        """Create sample activity logs with proper user_agent"""
        try:
            from manga.models.base import ActivityType
            
            # Create some sample activity logs
            sample_logs = [
                {
                    'action_type': ActivityType.SYSTEM_ERROR,
                    'description': 'Sample data loading completed successfully',
                    'user_agent': 'Django Management Command',
                    'severity': 'info'
                },
                {
                    'action_type': ActivityType.ADMIN_ACTION,
                    'description': 'Test data created for development',
                    'user_agent': 'Development Environment',
                    'severity': 'info'
                }
            ]
            
            for log_data in sample_logs:
                ActivityLog.objects.create(**log_data)
                
            self.stdout.write('Created sample activity logs')
            
        except Exception as e:
            self.stdout.write(f'Could not create activity logs: {e}')