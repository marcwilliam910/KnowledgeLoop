from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Category, Quiz, Question
from .serializers import CategorySerializer, QuizSerializer, QuestionSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import user_passes_test
from rest_framework.permissions import AllowAny



class QuizViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def list(self, request):
        category = request.query_params.get('category', None)
        if category:
            queryset = Category.objects.filter(name=category)
            if not queryset.exists():
                return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(queryset.first())
            return Response(serializer.data)
        else:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

    # Create a new quiz under a category
    @action(detail=False, methods=['post'], url_path='(?P<category_name>[^/.]+)')
    def create_quiz(self, request, category_name=None):
        category, created = Category.objects.get_or_create(name=category_name)
        quiz_data = request.data
        quiz_data['category'] = category.id
        quiz_serializer = QuizSerializer(data=quiz_data, context={'category': category})

        if quiz_serializer.is_valid():
            quiz = quiz_serializer.save()
            response_data = {
                'message': 'Quiz created successfully',
                'quiz': quiz_serializer.data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(quiz_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # Retrieve a specific quiz by category and quiz name
    @action(detail=False, methods=['get'], url_path='(?P<category_name>[^/.]+)/(?P<quiz_name>[^/.]+)')
    def get_quiz(self, request, category_name=None, quiz_name=None):
        category = get_object_or_404(Category, name=category_name)
        quiz = get_object_or_404(Quiz, category=category, name=quiz_name)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data)

    # Manage a specific quiz (PUT, PATCH, DELETE)
    @action(detail=False, methods=['put', 'patch', 'delete'], url_path='(?P<category_name>[^/.]+)/(?P<quiz_name>[^/.]+)/(?P<quiz_id>[^/.]+)')
    def manage_quiz(self, request, category_name=None, quiz_name=None, quiz_id=None):
        if not request.user.is_staff:
            return Response({"error": "Only admins can manage quizzes"}, status=status.HTTP_403_FORBIDDEN)

        quiz = get_object_or_404(Quiz, id=quiz_id, category__name=category_name, name=quiz_name)

        if request.method == 'DELETE':
            quiz.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = QuizSerializer(quiz, data=request.data, partial=request.method=='PATCH')
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='(?P<category_name>[^/.]+)/(?P<quiz_name>[^/.]+)')
    def delete_quiz(self, request, category_name=None, quiz_name=None):
        category = get_object_or_404(Category, name=category_name)
        quiz = get_object_or_404(Quiz, category=category, name=quiz_name)
        quiz.delete()
        return Response({"message": f"Quiz '{quiz_name}' in category '{category_name}' has been deleted."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['put', 'patch'], url_path='(?P<category_name>[^/.]+)/(?P<quiz_name>[^/.]+)/edit')
    def edit_quiz(self, request, category_name=None, quiz_name=None):
        category = get_object_or_404(Category, name=category_name)
        quiz = get_object_or_404(Quiz, category=category, name=quiz_name)
        
        serializer = QuizSerializer(quiz, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Quiz updated successfully", "quiz": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User Registration
class UserRegistrationView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password)
        return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)


# User Login
class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


# Admin Login
class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None and user.is_staff:
            login(request, user)
            return Response({"message": "Admin login successful."}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid admin credentials or not an admin."}, status=status.HTTP_401_UNAUTHORIZED)
