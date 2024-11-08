from rest_framework import serializers
from .models import *

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'full_name', 'is_admin']
        

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name','imageGenre']



        

class BookSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    genre = GenreSerializer(many=True)
    read_count = serializers.IntegerField( )
    favorite_count = serializers.IntegerField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'image', 'genre', 'pdf', 'read_count', 'favorite_count']

class AuthorSerializer(serializers.ModelSerializer):
    books = BookSerializer(many=True, read_only=True)
    
    class Meta:
        model = Author
        fields = ['id', 'name','imageAuthor', 'books']

class ReadSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    reader = CustomUserSerializer(read_only=True)

    class Meta:
        model = Read
        fields = ['id', 'book', 'reader']
        

class FavoriteSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'book', 'user']