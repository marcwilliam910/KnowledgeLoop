from django.contrib import admin
from .models import Category, Quiz, Question

# Register Category model
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

admin.site.register(Category, CategoryAdmin)

# Register Quiz model
class QuizAdmin(admin.ModelAdmin):
    list_display = ('category', 'name')
    search_fields = ('name', 'category__name')
    list_filter = ('category',)

admin.site.register(Quiz, QuizAdmin)

# Register Question model
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'question', 'answer')
    search_fields = ('question', 'quiz__name')
    list_filter = ('quiz',)

admin.site.register(Question, QuestionAdmin)
