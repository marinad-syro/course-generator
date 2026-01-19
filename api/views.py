
from lrn_org.models import Area, Module, Lesson, LessonProgress
from .serializers import AreaSerializer, ModuleSerializer, ModuleListSerializer, LessonSerializer, LessonProgressSerializer
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from api_fetcher.generators.llama_generator import gen_pathway, gen_lesson_content
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings

@permission_classes([IsAuthenticated])
@api_view(['GET', 'POST', 'DELETE'])
def area_list_api(request):
    if request.method == "GET":
        try:
            areas = Area.objects.filter(user=request.user)
            serializer = AreaSerializer(areas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "POST":
        try:
            serializer = AreaSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        try:
            area_id = request.data.get('id')
            if area_id:
                area = Area.objects.get(id=area_id)
                area.delete()
                return Response({"message": "Area deleted successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Area ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        except Area.DoesNotExist:
            return Response({"error": "Area not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def area_detail_api(request, area_id):
    try:
        area = Area.objects.get(id=area_id, user=request.user)
        serializer = AreaSerializer(area)
        return Response(serializer.data)
    except Area.DoesNotExist:
        return Response({"error": "Area not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET', 'POST', 'DELETE'])
def module_list_api(request, area_id):
    if request.method == "GET":
        modules = Module.objects.filter(area_id=area_id)
        serializer = ModuleListSerializer(modules, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = ModuleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        try:
            module_id = request.data.get('id')
            if module_id:
                module = Module.objects.get(id=module_id)
                module.delete()
                return Response({"message": "Module deleted successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Module ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        except Module.DoesNotExist:
            return Response({"error": "Module not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 
        
@permission_classes([IsAuthenticated])
@api_view(['GET', 'POST'])
def lesson_list_api(request, module_id):
    if request.method == "GET":
        lessons = Lesson.objects.filter(module_id=module_id)
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAuthenticated])
@api_view(['GET', 'PUT', 'DELETE'])
def lesson_detail_api(request, lesson_id):
    if request.method == "GET":
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            serializer = LessonSerializer(lesson)
            return Response(serializer.data)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == "PUT":
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            serializer = LessonSerializer(lesson, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == "DELETE":
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            lesson.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)


@permission_classes([IsAuthenticated])
@api_view(['POST'])
def generate_pathway(request):
    area_name = request.data.get("area")
    if not area_name:
        return Response({"error": "Area is required"}, status=status.HTTP_400_BAD_REQUEST)

    data = gen_pathway(area_name)

    area = Area.objects.create(name=data.get("title", area_name), user=request.user)

    for mod in data.get("modules", []):
        module = Module.objects.create(
            name=mod.get("title", "Untitled Module"),
            area=area
        )
        for les in mod.get("lessons", []):
            Lesson.objects.create(
                name=les.get("title", "Untitled Lesson"),
                module=module
            )

    serializer = AreaSerializer(area)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_pathway_json(request):
    area_name = request.data.get("area")
    if not area_name:
        return Response({"error": "Area is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Step 1: Generate pathway data
        data = gen_pathway(area_name)

        if not data or not isinstance(data, dict):
            return Response(
                {"error": "Failed to generate pathway data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Step 2: Save to database
        try:
            area = Area.objects.create(
                name=data.get("title", area_name),
                user=request.user
            )

            # Step 3: Create modules and lessons
            for mod_idx, mod in enumerate(data.get("modules", [])):
                try:
                    module = Module.objects.create(
                        name=mod.get("title", f"Module {mod_idx + 1}"),
                        area=area
                    )

                    for les_idx, les in enumerate(mod.get("lessons", [])):
                        try:
                            Lesson.objects.create(
                                name=les.get("title", f"Lesson {les_idx + 1}"),
                                module=module
                            )
                        except Exception:
                            continue

                except Exception:
                    continue

            # Return serialized area for consistency with other endpoints
            serializer = AreaSerializer(area)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": "Database error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        return Response(
            {"error": "Failed to generate pathway", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_lesson_content(request):
    lesson_id = request.data.get("lesson_id")

    # Support legacy requests without lesson_id
    if not lesson_id:
        area = request.data.get("area")
        module = request.data.get("module")
        topic = request.data.get("topic")

        if not all([area, module, topic]):
            return Response({"error": "Either lesson_id OR (area, module, topic) are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            generated_content = gen_lesson_content(topic=topic, area=area, module=module)
            return Response({"content": generated_content}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # New flow: check if content exists, generate and save if not
    try:
        lesson = Lesson.objects.get(id=lesson_id)

        # Check if lesson already has content
        if lesson.content and lesson.content.strip():
            return Response({"content": lesson.content}, status=status.HTTP_200_OK)

        # Generate new content
        area_name = lesson.module.area.name
        module_name = lesson.module.name
        lesson_name = lesson.name

        generated_content = gen_lesson_content(
            topic=lesson_name,
            area=area_name,
            module=module_name
        )

        # Save to database
        lesson.content = generated_content
        lesson.save()

        return Response({"content": generated_content}, status=status.HTTP_200_OK)

    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_lesson_complete(request, lesson_id):
    """Mark a lesson as complete or incomplete for the current user."""
    try:
        lesson = Lesson.objects.get(id=lesson_id)

        # Get or create progress record
        progress, created = LessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            defaults={'completed': True, 'completed_at': timezone.now()}
        )

        if not created:
            # Toggle completion status
            progress.completed = not progress.completed
            progress.completed_at = timezone.now() if progress.completed else None
            progress.save()

        return Response({
            'lesson_id': lesson_id,
            'completed': progress.completed,
            'completed_at': progress.completed_at
        })

    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson_progress(request, lesson_id):
    """Get progress status for a specific lesson."""
    try:
        progress = LessonProgress.objects.filter(
            user=request.user,
            lesson_id=lesson_id
        ).first()

        return Response({
            'lesson_id': lesson_id,
            'completed': progress.completed if progress else False,
            'completed_at': progress.completed_at if progress else None
        })

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_area_progress(request, area_id):
    """Get progress for all lessons in an area (pathway), grouped by module."""
    try:
        area = Area.objects.get(id=area_id, user=request.user)

        # Get all completed lesson IDs for this user in this area
        completed_lessons = set(
            LessonProgress.objects.filter(
                user=request.user,
                completed=True,
                lesson__module__area=area
            ).values_list('lesson_id', flat=True)
        )

        # Build progress data
        modules_progress = []
        total_lessons = 0
        total_completed = 0

        for module in area.modules.all():
            lessons_data = []
            module_completed = 0

            for lesson in module.lessons.all():
                is_completed = lesson.id in completed_lessons
                lessons_data.append({
                    'id': lesson.id,
                    'name': lesson.name,
                    'completed': is_completed
                })
                if is_completed:
                    module_completed += 1
                total_lessons += 1

            total_completed += module_completed
            modules_progress.append({
                'id': module.id,
                'name': module.name,
                'lessons': lessons_data,
                'completed_count': module_completed,
                'total_count': len(lessons_data),
                'percentage': round((module_completed / len(lessons_data) * 100) if lessons_data else 0)
            })

        return Response({
            'area_id': area_id,
            'area_name': area.name,
            'modules': modules_progress,
            'total_lessons': total_lessons,
            'completed_lessons': total_completed,
            'percentage': round((total_completed / total_lessons * 100) if total_lessons else 0)
        })

    except Area.DoesNotExist:
        return Response({"error": "Area not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)