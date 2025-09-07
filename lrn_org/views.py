from django.shortcuts import render, get_object_or_404, redirect
from .models import Area, Module, Lesson
from .forms import AreaForm, ModuleForm, LessonForm

def home_page(request):
    return render(request, "lrn_org/home.html")

def area_list(request):
    areas = Area.objects.all()
    return render(request, "lrn_org/area_list.html", {"areas": areas})

def module_list(request, area_id):
    area = get_object_or_404(Area, id=area_id)
    modules = area.modules.all()
    return render(request, "lrn_org/module_list.html", {"area": area, "modules": modules})

def lesson_list(request, module_id):
    module = get_object_or_404(Module, id=module_id)
    lessons = module.lessons.all()
    return render(request, "lrn_org/lesson_list.html", {"module": module, "lessons": lessons})

def add_area(request):
    if request.method == "POST":
        form = AreaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("area_list")
    else:
        form = AreaForm()
    return render(request, "lrn_org/add_area.html", {"form": form})

def add_module(request):
    if request.method == "POST":
        form = ModuleForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("area_list")
    else:
        form = ModuleForm()
    return render(request, "lrn_org/add_module.html", {"form": form})

def add_lesson(request):
    if request.method == "POST":
        form = LessonForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("area_list")
    else:
        form = LessonForm()
    return render(request, "lrn_org/add_lesson.html", {"form": form})

def see_lesson(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    return render(request, "lrn_org/see_lesson.html", {"lesson": lesson})


