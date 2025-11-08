from django.shortcuts import render
from rest_framework import viewsets
from .models import Course, Chapter
from .serializers import CourseSerializer, ChapterSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [AllowAny]
