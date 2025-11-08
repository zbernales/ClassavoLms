from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Course, Chapter
from .serializers import CourseSerializer, ChapterSerializer
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission, SAFE_METHODS, AllowAny

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_courses(request):
    user = request.user
    
    if user.profile.role == "instructor":
        courses = Course.objects.filter(instructor=user)
    else:
        courses = user.enrolled_courses.all()

    courses = courses.distinct()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role == "instructor"
    
class IsInstructorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.profile.role == "instructor"
    
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        course = self.get_object()  
        user = request.user
        course.students.add(user)
        return Response({"message": f"You have joined {course.title}"})

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

