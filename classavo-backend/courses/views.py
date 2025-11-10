from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Course, Chapter
from .serializers import CourseSerializer, ChapterSerializer, UserSerializer
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
    
    def retrieve(self, request, *args, **kwargs):
        course = self.get_object()
        return Response(self.get_serializer(course).data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        course = self.get_object()  
        user = request.user
        course.students.add(user)
        return Response({"message": f"You have joined {course.title}"})
    
    @action(detail=True, methods=["get"])
    def students(self, request, pk=None):
        course = self.get_object()
        enrolled = course.students.all()
        return Response(UserSerializer(enrolled, many=True).data)

    @action(detail=True, methods=["delete"], url_path="students/(?P<user_id>[^/.]+)")
    def remove_student(self, request, pk=None, user_id=None):
        course = self.get_object()
        student = course.students.filter(id=user_id).first()
        if not student:
            return Response({"detail": "Student not found"}, status=404)
        course.students.remove(student)
        return Response(status=204)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def unenroll(self, request, pk=None):
        course = self.get_object()
        course.students.remove(request.user)
        return Response({"message": "Unenrolled"}, status=200)
    
    def destroy(self, request, *args, **kwargs):
        course = self.get_object()
        if request.user != course.instructor:
            return Response({"error": "Only instructor can delete"}, status=403)
        return super().destroy(request, *args, **kwargs)

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [IsInstructorOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(course_id=self.request.data.get("course"))

    def get_queryset(self):
        user = self.request.user

        if self.action in ['retrieve', 'toggle_visibility', 'delete_chapter', 'update_chapter']:
            return Chapter.objects.all()

        course_id = self.request.query_params.get('course')
        if not course_id:
            return Chapter.objects.none()

        if user.profile.role == "instructor":
            return Chapter.objects.filter(course_id=course_id)
        else:
            return Chapter.objects.filter(course_id=course_id, is_public=True, course__students=user)
    
    @action(detail=True, methods=["patch"])
    def toggle_visibility(self, request, pk=None):
        chapter = self.get_object()
        chapter.is_public = not chapter.is_public
        chapter.save()
        return Response({"is_public": chapter.is_public})
    
    
    @action(detail=True, methods=["delete"], permission_classes=[IsAuthenticated])
    def delete_chapter(self, request, pk=None):
        chapter = self.get_object()
        if request.user.profile.role != "instructor":
            return Response({"error": "Only instructors can delete chapters"}, status=403)
        chapter.delete()
        return Response(status=204)
    
    @action(detail=True, methods=["patch"])
    def update_chapter(self, request, pk=None):
        print(request.data)
        chapter = self.get_object()

        serializer = self.get_serializer(
            chapter,
            data=request.data,
            partial=True  
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


