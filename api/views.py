from django.shortcuts import render
from django.http import JsonResponse
from lrn_org.models import Area, Module, Lesson
from .serializers import AreaSerializer, ModuleSerializer, LessonSerializer
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

@api_view(['GET', 'POST'])
def area_list_api(request):
    if request.method == "GET":
        try:
            areas = Area.objects.all()
            serializer = AreaSerializer(areas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "POST":
        try:
            serializer = AreaSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def module_list_api(request, area_id):
    if request.method == "GET":
        modules = Module.objects.filter(area_id=area_id).values('id', 'name')
        serializer = ModuleSerializer(modules, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = ModuleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def lesson_list_api(request, module_id):
    if request.method == "GET":
        lessons = Lesson.objects.filter(module_id=module_id).values('id', 'name')
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
