from django.db import models
from django.contrib.auth.models import User

class Area(models.Model):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='areas', null=True, blank=True)

    def __str__(self):
        return self.name


class Module(models.Model):
    name = models.CharField(max_length=200)
    area = models.ForeignKey(
        Area,
        on_delete=models.CASCADE,
        related_name="modules"
    )

    def __str__(self):
        return self.name


class Lesson(models.Model):
    name = models.CharField(max_length=200)
    content = models.TextField(blank=True, default='')
    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="lessons"
    )

    def __str__(self):
        return self.name


class LessonProgress(models.Model):
    """Tracks user progress on individual lessons."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'lesson']
        verbose_name_plural = 'Lesson progress'

    def __str__(self):
        status = 'completed' if self.completed else 'in progress'
        return f"{self.user.username} - {self.lesson.name} ({status})"
