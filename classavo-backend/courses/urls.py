from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ChapterViewSet, my_courses

router = DefaultRouter()
router.register('courses', CourseViewSet)
router.register('chapters', ChapterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('my-courses/', my_courses, name='my-courses'),
]