# users/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def register_user(request):
    try:
        print("Registration request data:", request.data)  # Log the incoming data
        
        # Ensure username is provided, use email if not
        data = request.data.copy()
        if 'username' not in data and 'email' in data:
            data['username'] = data['email']
            print("Set username to email:", data['username'])
            
        serializer = UserSerializer(data=data)
        
        if serializer.is_valid():
            print("Serializer is valid, creating user...")
            try:
                user = serializer.save()
                print(f"User created successfully: {user.username}")
                tokens = get_tokens_for_user(user)
                return Response(tokens, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error saving user: {str(e)}")
                return Response(
                    {"error": "Error creating user account", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            print("Serializer errors:", serializer.errors)
            return Response(
                {"error": "Invalid data", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        print(f"Unexpected error in register_user: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred during registration"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def login(request):
    try:
        print("Login attempt with data:", request.data)
        
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"error": "Both username and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        print(f"Attempting to authenticate user: {username}")
        user = authenticate(username=username, password=password)
        
        if user is not None:
            print(f"User {username} authenticated successfully")
            try:
                tokens = get_tokens_for_user(user)
                return Response(tokens)
            except Exception as e:
                print(f"Error generating tokens: {str(e)}")
                return Response(
                    {"error": "Error generating authentication tokens"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            print(f"Authentication failed for user: {username}")
            return Response(
                {"error": "Invalid username or password"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        print(f"Unexpected error in login: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred during login"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
