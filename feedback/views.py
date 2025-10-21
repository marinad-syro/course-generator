
from rest_framework import generics
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework import permissions

class FeedbackCreateView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.AllowAny]

