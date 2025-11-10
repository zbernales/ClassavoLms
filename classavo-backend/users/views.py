from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from .serializers import SignUpSerializer
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    profile = request.user.profile
    return Response({
        'username': request.user.username,
        'role': profile.role,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'email': request.user.email
    })

class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]  

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "User created successfully",
            "user": {
                "username": user.username,
                "email": user.email,
                "role": user.profile.role,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "token": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)