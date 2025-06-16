from rest_framework import serializers
from .models import Post, Like, Comment
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Item
        fields = ["id", "title"]   # include any extra model fields here


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    likes = LikeSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'likes', 'comments']
