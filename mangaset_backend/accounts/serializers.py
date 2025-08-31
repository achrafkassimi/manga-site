from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        
        # Validate password strength
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        print(validated_data)
        # print(user) DETAIL:  La ligne en échec contient (10, 2025-08-31 18:50:27.218876+00, user_register, New user registered: hhhhhyy, null, null, {"email": "hhhhhyy@example.com"}, info, 23, null, null).
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    # reading_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined')
    
    # def get_reading_stats(self, obj):
    #     from manga.models import UserFavorite, ReadingHistory
    #     return {
    #         'favorites_count': UserFavorite.objects.filter(user=obj).count(),
    #         'reading_history_count': ReadingHistory.objects.filter(user=obj).count(),
    #     }