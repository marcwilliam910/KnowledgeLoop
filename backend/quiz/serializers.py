from rest_framework import serializers
from .models import Category, Quiz, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question', 'options', 'answer']

class QuizSerializer(serializers.ModelSerializer):
    quiz = QuestionSerializer(many=True, source='questions')

    class Meta:
        model = Quiz
        fields = ['id', 'name', 'quiz']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        category = self.context.get('category')
        quiz = Quiz.objects.create(category=category, **validated_data)
        
        for question_data in questions_data:
            Question.objects.create(quiz=quiz, **question_data)
        
        return quiz

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Update or create questions
        existing_questions = {question.id: question for question in instance.questions.all()}
        question_ids_to_keep = set()

        for question_data in questions_data:
            question_id = question_data.get('id')
            if question_id and question_id in existing_questions:
                # Update existing question
                question = existing_questions[question_id]
                for attr, value in question_data.items():
                    setattr(question, attr, value)
                question.save()
                question_ids_to_keep.add(question_id)
            else:
                # Create new question
                Question.objects.create(quiz=instance, **question_data)

        # Delete questions not present in the update data
        for question_id, question in existing_questions.items():
            if question_id not in question_ids_to_keep:
                question.delete()

        return instance

class CategorySerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['name', 'quizzes']

