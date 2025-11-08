from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ChapterViewSet

router = DefaultRouter()
router.register('courses', CourseViewSet)
router.register('chapters', ChapterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]