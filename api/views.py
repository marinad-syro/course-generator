
from lrn_org.models import Area, Module, Lesson
from .serializers import AreaSerializer, ModuleSerializer, LessonSerializer
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
                serializer.save()
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
@api_view(['GET', 'POST', 'DELETE'])
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
    elif request.method == "DELETE":
        try:
            module_id = request.data.get('id')
            if module_id:
                module = module.objects.get(id=module_id)
                module.delete()
                return Response({"message": "Module deleted successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Module ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        except Area.DoesNotExist:
            return Response({"error": "Module not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 
        
@permission_classes([IsAuthenticated])
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
    print(f"[DEBUG] generate_pathway_json called by user: {request.user.id}")
    print(f"[DEBUG] Request data: {request.data}")
    
    area_name = request.data.get("area")
    if not area_name:
        return Response({"error": "Area is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Step 1: Generate pathway data
        print(f"[DEBUG] Generating pathway for area: {area_name}")
        data = gen_pathway(area_name)
        print(f'[DEBUG] Pathway generated: {data.get("title") if data else "No data"}')
        
        if not data or not isinstance(data, dict):
            return Response(
                {"error": "Failed to generate pathway data"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Step 2: Save to database
        print(f"[DEBUG] Creating area in database...")
        try:
            area = Area.objects.create(
                name=data.get("title", area_name), 
                user=request.user
            )
            print(f'[DEBUG] Area created with ID: {area.id}')
            
            # Step 3: Create modules and lessons
            for mod_idx, mod in enumerate(data.get("modules", [])):
                try:
                    module = Module.objects.create(
                        name=mod.get("title", f"Module {mod_idx + 1}"),
                        area=area
                    )
                    print(f'[DEBUG] Created module: {module.name}')
                    
                    for les_idx, les in enumerate(mod.get("lessons", [])):
                        try:
                            Lesson.objects.create(
                                name=les.get("title", f"Lesson {les_idx + 1}"),
                                module=module
                            )
                        except Exception as e:
                            print(f'[ERROR] Failed to create lesson: {str(e)}')
                            continue
                            
                except Exception as e:
                    print(f'[ERROR] Failed to create module: {str(e)}')
                    continue
            
            # Include the database ID in the response
            data['id'] = area.id
            return Response(data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f'[ERROR] Database error: {str(e)}')
            return Response(
                {"error": "Database error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        error_msg = f"Error generating pathway: {str(e)}"
        print(f'[ERROR] {error_msg}')
        import traceback
        traceback.print_exc()
        return Response(
            {"error": "Failed to generate pathway", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def generate_lesson_content(request):
    area = request.data.get("area")
    module = request.data.get("module")
    topic = request.data.get("topic")

    if not all([area, module, topic]):
        return Response({"error": "Area, module, and topic are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        generated_content = gen_lesson_content(topic=topic, area=area, module=module)
        return Response({"content": generated_content}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)