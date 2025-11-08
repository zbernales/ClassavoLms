from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ChapterViewSet, my_courses

router = DefaultRouter()
router.register('courses', CourseViewSet)
router.register('chapters', ChapterViewSet, basename='chapter')

urlpatterns = [
    path('', include(router.urls)),
    path('my-courses/', my_courses, name='my-courses'),
    path("courses/<int:pk>/students/", CourseViewSet.as_view({"get": "students"})),
    path("courses/<int:pk>/students/<int:user_id>/", CourseViewSet.as_view({"delete": "remove_student"})),
    path("courses/<int:pk>/unenroll/", CourseViewSet.as_view({"post": "unenroll"})),
]