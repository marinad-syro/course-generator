# users/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
from django.http import JsonResponse
from .serializers import UserSerializer


def ratelimit_error_response(request, exception):
    """Return JSON response for rate-limited requests."""
    return JsonResponse(
        {"error": "Too many attempts. Please try again later."},
        status=429
    )

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@ratelimit(key='ip', rate='3/m', method='POST', block=True)
@api_view(['POST'])
def register_user(request):
    try:
        # Ensure username is provided, use email if not
        data = request.data.copy()
        if 'username' not in data and 'email' in data:
            data['username'] = data['email']

        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            try:
                user = serializer.save()
                tokens = get_tokens_for_user(user)
                return Response(tokens, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {"error": "Error creating user account", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {"error": "Invalid data", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        return Response(
            {"error": "An unexpected error occurred during registration", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@ratelimit(key='ip', rate='5/m', method='POST', block=True)
@api_view(['POST'])
def login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Both username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is not None:
            try:
                tokens = get_tokens_for_user(user)
                return Response(tokens)
            except Exception as e:
                return Response(
                    {"error": "Error generating authentication tokens"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

    except Exception as e:
        return Response(
            {"error": "An unexpected error occurred during login"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
