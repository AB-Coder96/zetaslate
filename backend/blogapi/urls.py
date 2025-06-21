# urls.py
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, LikeViewSet, ItemListCreateView

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="post")
router.register(r"comments", CommentViewSet, basename="comment")
router.register(r"likes", LikeViewSet, basename="like")

urlpatterns = [
    # React grid hits GET /items  (trailing slash handled by APPEND_SLASH=True)
    path("items/", ItemListCreateView.as_view(), name="item-list"),
    # OR, if you truly need both /items and /items/ without using APPEND_SLASH:
    # re_path(r"^items/?$", ItemListCreateView.as_view(), name="item-list"),

    # Router-generated endpoints: /posts/, /comments/, /likes/, etc.
    path("", include(router.urls)),
]
__all__ = ["router", "urlpatterns"]
