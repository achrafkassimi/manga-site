# manga/management/commands/check_users.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Check existing users and create a test user if needed'
    
    def handle(self, *args, **options):
        self.stdout.write('Checking database users...')
        
        # List all users
        users = User.objects.all()
        self.stdout.write(f'Found {users.count()} users in database:')
        
        for user in users:
            self.stdout.write(f'  - {user.username} ({user.email}) - Active: {user.is_active}')
        
        # Check for our test users
        test_usernames = ['john_doe', 'jane_smith', 'admin']
        working_users = []
        
        for username in test_usernames:
            try:
                user = User.objects.get(username=username)
                if user.is_active:
                    working_users.append(username)
                    self.stdout.write(f'✅ {username} exists and is active')
                else:
                    self.stdout.write(f'❌ {username} exists but is inactive')
            except User.DoesNotExist:
                self.stdout.write(f'❌ {username} does not exist')
        
        # Create a test user if none exist
        if not working_users:
            self.stdout.write('\nCreating test user...')
            try:
                test_user = User.objects.create_user(
                    username='testuser',
                    email='test@example.com',
                    password='TestPassword123!',
                    first_name='Test',
                    last_name='User'
                )
                self.stdout.write('✅ Created test user: testuser / TestPassword123!')
                working_users.append('testuser')
            except Exception as e:
                self.stdout.write(f'❌ Failed to create test user: {e}')
        
        # Final status
        if working_users:
            self.stdout.write(f'\n🎉 Working users: {", ".join(working_users)}')
            self.stdout.write('Test these credentials in your authentication:')
            for username in working_users:
                if username == 'testuser':
                    self.stdout.write(f'  {username} / TestPassword123!')
                else:
                    self.stdout.write(f'  {username} / password123')
        else:
            self.stdout.write('\n❌ No working users available')
            self.stdout.write('Run: python manage.py createsuperuser')


# (venv) PS C:\Users\melua\Documents\manga-site\mangaset_backend> python manage.py check_users
# Checking database users...
# Found 6 users in database:
#   - john_doe (john@example.com) - Active: True
#   - jane_smith (jane@example.com) - Active: True
#   - otaku_master (otaku@example.com) - Active: True
#   - manga_lover (lover@example.com) - Active: True
#   - reader_pro (reader@example.com) - Active: True
#   - test_user (test@example.com) - Active: True
# ✅ john_doe exists and is active
# ✅ jane_smith exists and is active
# ❌ admin does not exist

# 🎉 Working users: john_doe, jane_smith
# Test these credentials in your authentication:
#   john_doe / password123
#   jane_smith / password123