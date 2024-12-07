from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, UserRegistrationView, UserLoginView, AdminLoginView

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
]