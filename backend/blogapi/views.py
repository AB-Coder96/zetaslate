from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets,generics, permissions
from .models import Post, Comment, Like
from .models import Item
from .serializers import ItemSerializer
from .serializers import PostSerializer, CommentSerializer, LikeSerializer

class ItemListCreateView(generics.ListCreateAPIView):
    """
    GET  /items   -> list all items (what your React grid calls)
    POST /items   -> create a new item (handy for admin screens/tests)
    """
    queryset           = Item.objects.all().order_by("-id")
    serializer_class   = ItemSerializer
    permission_classes = [permissions.AllowAny]   # tighten later if needed


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all().order_by('-created_at')
    serializer_class = LikeSerializer
