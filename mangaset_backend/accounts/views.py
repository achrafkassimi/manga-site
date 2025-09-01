# from rest_framework import status, generics, permissions
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import authenticate
# from django.contrib.auth.models import User
# from .serializers import UserRegistrationSerializer, UserProfileSerializer
# import logging

# logger = logging.getLogger(__name__)


# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [permissions.AllowAny]  # IMPORTANT: Allow anyone to register
#     serializer_class = UserRegistrationSerializer
    
#     def create(self, request, *args, **kwargs):
#         try:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             user = serializer.save()
            
#             # Generate tokens
#             refresh = RefreshToken.for_user(user)
            
#             return Response({
#                 'message': 'User created successfully',
#                 'user': UserProfileSerializer(user).data,
#                 'tokens': {
#                     'refresh': str(refresh),
#                     'access': str(refresh.access_token),
#                 }
#             }, status=status.HTTP_201_CREATED)
            
#         except Exception as e:
#             logger.error(f"Registration error: {str(e)}")
#             return Response({
#                 'error': 'Registration failed',
#                 'details': str(e)
#             }, status=status.HTTP_400_BAD_REQUEST)

# class UserProfileView(generics.RetrieveUpdateAPIView):
#     serializer_class = UserProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_object(self):
#         return self.request.user
    


from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .serializers import UserRegistrationSerializer, UserProfileSerializer
import logging

logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            # Temporarily disconnect the problematic signal
            from django.db.models.signals import post_save
            from manga.models.signals import log_user_registration
            
            post_save.disconnect(log_user_registration, sender=User)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Manually create activity log with proper user_agent
            from manga.models.admin_models import ActivityLog
            from manga.models.base import ActivityType
            
            ActivityLog.log(
                action_type=ActivityType.USER_REGISTER,
                description=f'New user registered: {user.username}',
                user=user,
                user_agent=request.META.get('HTTP_USER_AGENT', 'API Registration'),
                ip_address=self.get_client_ip(request),
                metadata={'email': user.email}
            )
            
            # Reconnect the signal
            post_save.connect(log_user_registration, sender=User)
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'User created successfully',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            # Make sure to reconnect signal even if error occurs
            post_save.connect(log_user_registration, sender=User)
            return Response({
                'error': 'Registration failed',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def custom_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    else:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)