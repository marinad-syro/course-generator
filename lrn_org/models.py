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
