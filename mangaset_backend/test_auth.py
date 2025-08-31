# debug_auth.py - Debug and fix authentication issues
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_user_exists():
    """Check if our test user exists via Django admin or create one"""
    print("Checking if test users exist...")
    
    # Try different usernames that might exist
    test_users = [
        {"username": "john_doe", "password": "password123"},
        {"username": "admin", "password": "admin123"},
        {"username": "test", "password": "test123"},
    ]
    
    for user_creds in test_users:
        try:
            response = requests.post(f"{BASE_URL}/auth/token/", json=user_creds)
            if response.status_code == 200:
                print(f"✅ Found working user: {user_creds['username']}")
                return user_creds
            else:
                print(f"❌ User {user_creds['username']} failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Error testing {user_creds['username']}: {e}")
    
    print("No existing test users found")
    return None

def test_registration_with_strong_password():
    """Test registration with a stronger password"""
    print("\nTesting registration with strong password...")
    
    register_data = {
        "username": "testuser2025",
        "email": "testuser2025@example.com", 
        "password": "MySecurePassword2025!@#",  # Strong password
        "password_confirm": "MySecurePassword2025!@#",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
        print(f"Registration Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            data = response.json()
            print(f"New user created: {data.get('user', {}).get('username')}")
            return {
                "username": register_data["username"], 
                "password": register_data["password"]
            }
        else:
            print(f"❌ Registration failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return None

def test_login_with_user(user_creds):
    """Test login with given credentials"""
    if not user_creds:
        return None
        
    print(f"\nTesting login with {user_creds['username']}...")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=user_creds)
        print(f"Login Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            data = response.json()
            token = data.get('tokens', {}).get('access')
            print(f"Access token received: {token[:20] if token else 'None'}...")
            return token
        else:
            print(f"❌ Login failed: {response.text}")
            
        # Also try JWT token endpoint
        response2 = requests.post(f"{BASE_URL}/auth/token/", json=user_creds)
        print(f"JWT Token Status: {response2.status_code}")
        
        if response2.status_code == 200:
            print("✅ JWT Token login successful!")
            data2 = response2.json()
            token = data2.get('access')
            print(f"JWT Access token: {token[:20] if token else 'None'}...")
            return token
        else:
            print(f"❌ JWT Token failed: {response2.text}")
            
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    return None

def test_profile_access(token):
    """Test accessing protected profile endpoint"""
    if not token:
        print("\n❌ No token available for profile test")
        return
        
    print("\nTesting profile access...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
        print(f"Profile Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Profile access successful!")
            data = response.json()
            print(f"User: {data.get('username')} ({data.get('email')})")
        else:
            print(f"❌ Profile access failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Profile error: {e}")

def main():
    print("🔧 Authentication Debug & Fix Script")
    print("="*50)
    
    # Step 1: Check for existing users
    existing_user = test_user_exists()
    
    # Step 2: If no existing user works, try registration
    if not existing_user:
        print("\nNo working users found. Attempting registration...")
        new_user = test_registration_with_strong_password()
        working_user = new_user
    else:
        working_user = existing_user
    
    # Step 3: Test login with working user
    token = test_login_with_user(working_user)
    
    # Step 4: Test profile access
    test_profile_access(token)
    
    print("\n" + "="*50)
    print("DIAGNOSIS & SOLUTIONS:")
    
    if token:
        print("✅ Authentication is working correctly!")
        print(f"Working credentials: {working_user['username']} / {working_user['password']}")
        print("\nYou can now use these credentials in Postman or your frontend.")
    else:
        print("❌ Authentication still has issues.")
        print("\nPossible causes:")
        print("1. Django server not running")
        print("2. Database connection issues") 
        print("3. JWT configuration problems")
        print("4. URL routing issues")
        
        print("\nQuick fixes to try:")
        print("1. Run: python manage.py createsuperuser")
        print("2. Check: python manage.py shell")
        print("   >>> from django.contrib.auth.models import User")
        print("   >>> User.objects.all()")
        print("3. Verify settings.py has 'accounts' in INSTALLED_APPS")

if __name__ == "__main__":
    main()