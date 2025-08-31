# test_api.py - Fixed API testing script
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_endpoint(url, description, method='GET', data=None, headers=None):
    """Test an API endpoint and display results"""
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"URL: {url}")
    print(f"Method: {method}")
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            json_data = response.json()
            if isinstance(json_data, dict):
                if 'results' in json_data:
                    print(f"Results count: {len(json_data['results'])}")
                    if json_data['results']:
                        print("Sample result:")
                        print(json.dumps(json_data['results'][0], indent=2)[:300] + "...")
                elif 'access' in json_data or 'refresh' in json_data:
                    # JWT token response
                    print("JWT tokens received:")
                    print(f"Access token: {json_data.get('access', 'N/A')[:20]}...")
                    print(f"Refresh token: {json_data.get('refresh', 'N/A')[:20]}...")
                else:
                    print("Response data:")
                    print(json.dumps(json_data, indent=2)[:300] + "...")
            elif isinstance(json_data, list):
                print(f"List count: {len(json_data)}")
                if json_data:
                    print("Sample item:")
                    print(json.dumps(json_data[0], indent=2)[:300] + "...")
        else:
            print(f"Error Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to server. Make sure Django server is running on localhost:8000")
    except Exception as e:
        print(f"ERROR: {str(e)}")

def main():
    print("🚀 Testing Manga Set API Endpoints")
    print("Make sure your Django server is running: python manage.py runserver")
    
    # Test public endpoints
    test_endpoint(f"{BASE_URL}/v1/manga/", "List All Manga")
    test_endpoint(f"{BASE_URL}/v1/manga/lists/popular/", "Popular Manga")
    test_endpoint(f"{BASE_URL}/v1/manga/lists/featured/", "Featured Manga")
    test_endpoint(f"{BASE_URL}/v1/manga/lists/latest/", "Latest Updates")
    test_endpoint(f"{BASE_URL}/v1/manga/lists/new/", "New Series")
    test_endpoint(f"{BASE_URL}/v1/genres/", "List All Genres")
    test_endpoint(f"{BASE_URL}/v1/search/?q=dragon", "Search Manga - 'dragon'")
    
    # Test authentication - FIXED: Use correct endpoint and data format
    print(f"\n{'='*60}")
    print("Testing Authentication...")
    
    # Try different authentication endpoints
    auth_endpoints = [
        '/auth/login/',  # Django Simple JWT endpoint
        '/auth/token/',  # Alternative JWT endpoint  
    ]
    
    login_data = {
        "username": "john_doe",
        "password": "password123"
    }
    
    auth_headers = None
    tokens = None
    
    for auth_endpoint in auth_endpoints:
        try:
            print(f"Trying authentication endpoint: {auth_endpoint}")
            login_response = requests.post(f"{BASE_URL}{auth_endpoint}", json=login_data)
            
            if login_response.status_code == 200:
                tokens = login_response.json()
                
                # Handle different response formats
                access_token = None
                if 'access' in tokens:
                    access_token = tokens['access']
                elif 'access_token' in tokens:
                    access_token = tokens['access_token']
                elif 'token' in tokens:
                    access_token = tokens['token']
                
                if access_token:
                    auth_headers = {
                        'Authorization': f'Bearer {access_token}'
                    }
                    print("✅ Authentication successful!")
                    print(f"Access token received: {access_token[:20]}...")
                    break
                else:
                    print(f"❌ Unexpected token format: {tokens}")
            else:
                print(f"❌ Authentication failed on {auth_endpoint}: {login_response.text}")
                
        except Exception as e:
            print(f"❌ Authentication error on {auth_endpoint}: {str(e)}")
    
    # Test authenticated endpoints if we got tokens
    if auth_headers:
        test_endpoint(f"{BASE_URL}/v1/user/favorites/", "User Favorites", headers=auth_headers)
        test_endpoint(f"{BASE_URL}/v1/user/history/", "Reading History", headers=auth_headers)
        test_endpoint(f"{BASE_URL}/v1/user/stats/", "User Statistics", headers=auth_headers)
    else:
        print("❌ Could not authenticate - skipping protected endpoints")
        print("Available auth endpoints:")
        print("- http://localhost:8000/api/auth/login/")
        print("- http://localhost:8000/api/auth/token/")
        print(f"Test credentials: john_doe / password123")
    
    print(f"\n{'='*60}")
    print("🎉 API Testing Complete!")
    
    if tokens:
        print("✅ Your API is working! Authentication successful.")
        print("\nNext steps:")
        print("1. Connect your React frontend to these endpoints")
        print("2. Use the JWT tokens for authenticated requests")
        print("3. Implement user features (favorites, history)")
        print("4. Add more manga data as needed")
    else:
        print("⚠️  API endpoints work but authentication needs setup")
        print("\nTo fix authentication:")
        print("1. Ensure JWT authentication is properly configured")
        print("2. Check if accounts app is included in INSTALLED_APPS") 
        print("3. Verify auth URLs are included in main urls.py")

if __name__ == "__main__":
    main()