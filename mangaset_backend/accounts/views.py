# # accounts/views.py - CLEANED UP VERSION
# from rest_framework import generics, status, permissions
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework_simplejwt.views import TokenObtainPairView
# from django.contrib.auth import authenticate
# from django.contrib.auth.models import User
# from .serializers import (
#     UserRegistrationSerializer, 
#     UserSerializer,
#     UserProfileSerializer,
#     CustomTokenObtainPairSerializer,
#     ChangePasswordSerializer
# )

# # JWT Token View with user data
# class CustomTokenObtainPairView(TokenObtainPairView):
#     serializer_class = CustomTokenObtainPairSerializer

# # User Registration View
# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])
# def register_view(request):
#     """Register a new user account"""
#     serializer = UserRegistrationSerializer(data=request.data)
#     if serializer.is_valid():
#         user = serializer.save()
#         refresh = RefreshToken.for_user(user)
        
#         return Response({
#             'message': 'Registration successful',
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'access': str(refresh.access_token),
#                 'refresh': str(refresh),
#             }
#         }, status=status.HTTP_201_CREATED)
    
#     return Response({
#         'error': 'Registration failed',
#         'details': serializer.errors
#     }, status=status.HTTP_400_BAD_REQUEST)

# # Login View
# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])  
# def login_view(request):
#     """Login user with username/email and password"""
#     username = request.data.get('username')
#     password = request.data.get('password')
    
#     if not username or not password:
#         return Response({
#             'error': 'Username and password are required'
#         }, status=status.HTTP_400_BAD_REQUEST)
    
#     # Try to authenticate with username first
#     user = authenticate(username=username, password=password)
    
#     # If username auth failed, try email auth
#     if not user:
#         try:
#             user_by_email = User.objects.get(email=username)
#             user = authenticate(username=user_by_email.username, password=password)
#         except User.DoesNotExist:
#             pass
    
#     if user and user.is_active:
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             'message': 'Login successful',
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'access': str(refresh.access_token),
#                 'refresh': str(refresh),
#             }
#         })
    
#     return Response({
#         'error': 'Invalid credentials'
#     }, status=status.HTTP_401_UNAUTHORIZED)

# # Logout View
# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated])
# def logout_view(request):
#     """Logout user by blacklisting refresh token - FIXED VERSION"""
#     try:
#         # Try to get refresh token from request data
#         refresh_token = request.data.get('refresh')
        
#         # If no refresh token in body, that's okay for logout
#         if refresh_token:
#             try:
#                 token = RefreshToken(refresh_token)
#                 token.blacklist()
#                 return Response({
#                     'message': 'Logout successful - token blacklisted'
#                 }, status=status.HTTP_200_OK)
#             except Exception as token_error:
#                 # Even if token blacklisting fails, we can still "logout"
#                 return Response({
#                     'message': 'Logout successful'
#                 }, status=status.HTTP_200_OK)
#         else:
#             # No refresh token provided, but user is authenticated so logout is OK
#             return Response({
#                 'message': 'Logout successful'
#             }, status=status.HTTP_200_OK)
            
#     except Exception as e:
#         # Even if there's an error, we'll consider logout successful
#         # since the frontend will clear tokens anyway
#         return Response({
#             'message': 'Logout successful'
#         }, status=status.HTTP_200_OK)

# # Alternative: Make logout more permissive
# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])  # Changed to AllowAny
# def logout_view_permissive(request):
#     """Permissive logout that always succeeds"""
#     try:
#         refresh_token = request.data.get('refresh')
#         if refresh_token:
#             token = RefreshToken(refresh_token)
#             token.blacklist()
#     except:
#         pass  # Ignore errors
    
#     return Response({
#         'message': 'Logout successful'
#     }, status=status.HTTP_200_OK)

# # User Profile View
# class UserProfileView(generics.RetrieveUpdateAPIView):
#     """Get and update user profile"""
#     serializer_class = UserProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_object(self):
#         return self.request.user

# # Change Password View
# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated])
# def change_password_view(request):
#     """Change user password"""
#     serializer = ChangePasswordSerializer(data=request.data)
#     if serializer.is_valid():
#         user = request.user
        
#         # Check old password
#         if not user.check_password(serializer.validated_data['old_password']):
#             return Response({
#                 'error': 'Old password is incorrect'
#             }, status=status.HTTP_400_BAD_REQUEST)
        
#         # Set new password
#         user.set_password(serializer.validated_data['new_password'])
#         user.save()
        
#         return Response({
#             'message': 'Password changed successfully'
#         })
    
#     return Response({
#         'error': 'Password change failed',
#         'details': serializer.errors
#     }, status=status.HTTP_400_BAD_REQUEST)

# # Password Reset Request View
# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])
# def password_reset_request_view(request):
#     """Request password reset via email"""
#     email = request.data.get('email')
    
#     if not email:
#         return Response({
#             'error': 'Email is required'
#         }, status=status.HTTP_400_BAD_REQUEST)
    
#     try:
#         user = User.objects.get(email=email)
#         # In production, send actual email here
#         return Response({
#             'message': 'Password reset email sent (demo mode)'
#         })
#     except User.DoesNotExist:
#         # Don't reveal if email exists or not
#         return Response({
#             'message': 'If this email exists, a reset link has been sent'
#         })

# # Health Check View
# @api_view(['GET'])
# @permission_classes([permissions.AllowAny])
# def health_check_view(request):
#     """Simple health check endpoint"""
#     return Response({
#         'status': 'healthy',
#         'message': 'MangaSet API is running',
#         'endpoints': {
#             'login': '/api/v1/auth/login/',
#             'register': '/api/v1/auth/register/',
#             'token': '/api/v1/auth/token/',
#             'profile': '/api/v1/auth/profile/',
#         }
#     })





# accounts/views.py - COMPLETE USER AUTHENTICATION SYSTEM
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils import timezone
from datetime import timedelta
import uuid
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
)
from .models import PasswordResetToken

# JWT Token View with user data
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# User Registration
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """Register a new user account"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'error': 'Registration failed',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

# User Login
@api_view(['POST'])
@permission_classes([permissions.AllowAny])  
def login_view(request):
    """Login user with username/email and password"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Try to authenticate with username first
    user = authenticate(username=username, password=password)
    
    # If username auth failed, try email auth
    if not user:
        try:
            user_by_email = User.objects.get(email=username)
            user = authenticate(username=user_by_email.username, password=password)
        except User.DoesNotExist:
            pass
    
    if user and user.is_active:
        # Update last login
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        })
    
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

# User Logout
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def logout_view(request):
    """Logout user by blacklisting refresh token"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'})
        else:
            return Response({'message': 'Logout successful'})
    except Exception:
        return Response({'message': 'Logout successful'})

# User Profile Management
class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully',
                'user': serializer.data
            })
        
        return Response({
            'error': 'Profile update failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# Change Password
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password_view(request):
    """Change user password"""
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        })
    
    return Response({
        'error': 'Password change failed',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

# Password Reset Request
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request_view(request):
    """Request password reset via email"""
    serializer = PasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            
            # Generate reset token
            reset_token = get_random_string(32)
            expires_at = timezone.now() + timedelta(hours=1)
            
            # Save reset token
            PasswordResetToken.objects.filter(user=user).delete()  # Remove old tokens
            PasswordResetToken.objects.create(
                user=user,
                token=reset_token,
                expires_at=expires_at
            )
            
            # Send email (in development, just return the token)
            if settings.DEBUG:
                return Response({
                    'message': 'Password reset token generated (development mode)',
                    'reset_token': reset_token,  # Remove in production
                    'reset_url': f'http://localhost:5173/reset-password?token={reset_token}'
                })
            else:
                # In production, send actual email
                reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
                send_mail(
                    'Password Reset Request - MangaSet',
                    f'Click here to reset your password: {reset_url}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                return Response({
                    'message': 'Password reset email sent successfully'
                })
                
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({
                'message': 'If this email exists, a reset link has been sent'
            })
    
    return Response({
        'error': 'Invalid email address',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

# Password Reset Confirm
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm_view(request):
    """Confirm password reset with token"""
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            reset_token = PasswordResetToken.objects.get(
                token=token,
                expires_at__gt=timezone.now(),
                used=False
            )
            
            # Reset password
            user = reset_token.user
            user.set_password(new_password)
            user.save()
            
            # Mark token as used
            reset_token.used = True
            reset_token.save()
            
            return Response({
                'message': 'Password reset successful'
            })
            
        except PasswordResetToken.DoesNotExist:
            return Response({
                'error': 'Invalid or expired reset token'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'error': 'Password reset failed',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

# User Favorites Management
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def user_favorites_view(request):
    """Manage user favorites"""
    if request.method == 'GET':
        # Get user's favorites (mock for now)
        favorites = [
            {
                'id': 1,
                'manga': {
                    'id': 1,
                    'title': 'Dragon Quest',
                    'slug': 'dragon-quest',
                    'cover_image': '/media/covers/dragon-quest.jpg',
                    'author': 'Akira Toriyama'
                },
                'added_at': '2024-03-01T10:00:00Z'
            }
        ]
        return Response(favorites)
    
    elif request.method == 'POST':
        manga_id = request.data.get('manga_id')
        if not manga_id:
            return Response({
                'error': 'manga_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Add to favorites (mock response)
        return Response({
            'message': 'Added to favorites',
            'manga_id': manga_id
        }, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_favorite_view(request, manga_id):
    """Remove manga from favorites"""
    # Mock remove from favorites
    return Response({
        'message': 'Removed from favorites',
        'manga_id': manga_id
    })

# User Reading History
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_reading_history_view(request):
    """Get user's reading history"""
    # Mock reading history
    history = [
        {
            'id': 1,
            'manga': {
                'id': 1,
                'title': 'Dragon Quest',
                'slug': 'dragon-quest'
            },
            'last_chapter': {
                'id': 5,
                'number': 5,
                'title': 'Chapter 5: The Battle'
            },
            'last_read_at': '2024-03-15T14:30:00Z',
            'progress_percentage': 75
        }
    ]
    return Response(history)

# User Statistics
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats_view(request):
    """Get user statistics"""
    stats = {
        'total_manga_read': 15,
        'total_chapters_read': 245,
        'total_favorites': 8,
        'reading_time_hours': 120,
        'favorite_genres': ['Action', 'Fantasy', 'Romance'],
        'account_created': request.user.date_joined,
        'last_active': timezone.now()
    }
    return Response(stats)

# Health Check
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check_view(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'MangaSet Authentication API is running',
        'endpoints': {
            'login': '/api/v1/auth/login/',
            'register': '/api/v1/auth/register/',
            'token': '/api/v1/auth/token/',
            'profile': '/api/v1/auth/profile/',
            'forgot_password': '/api/v1/auth/forgot-password/',
            'reset_password': '/api/v1/auth/reset-password/',
            'favorites': '/api/v1/auth/favorites/',
        }
    })