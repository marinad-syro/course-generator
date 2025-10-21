from django.db import models

class Feedback(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback received at {self.created_at.strftime('%Y-%m-%d %H:%M')}"

