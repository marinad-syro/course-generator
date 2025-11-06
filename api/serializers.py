from rest_framework import serializers
from lrn_org.models import Area, Module, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'name', 'content', 'module']

class LessonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'name', 'content']


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = ['id', 'name', 'area', 'lessons']

class ModuleListSerializer(serializers.ModelSerializer):
    lessons = LessonListSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = ['id', 'name', 'lessons']

class AreaSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    class Meta:
        model = Area
        fields = ['id', 'name', 'modules']
  