from django.urls import path
from .views import current_user
from .views import SignUpView

urlpatterns = [
    path("current-user/", current_user, name="current-user"),
    path('signup/', SignUpView.as_view(), name='signup'),
]