from django import forms
from .models import Area, Module, Lesson

class AreaForm(forms.ModelForm):
    class Meta:
        model = Area
        fields = ["name"]

class ModuleForm(forms.ModelForm):
    class Meta:
        model = Module
        fields = ["area", "name"]

class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ["module", "name", "content"]
