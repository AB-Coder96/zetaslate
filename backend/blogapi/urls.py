# urls.py   (blogapi)

from django.http import HttpResponseServerError
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, LikeViewSet, ItemListCreateView

router = DefaultRouter()
router.register(r"posts",     PostViewSet,     basename="post")
router.register(r"comments",  CommentViewSet, basename="comment")
router.register(r"likes",     LikeViewSet,    basename="like")

# ─── throw-away view that always raises ───────────────────────────
def force_error(request):
    raise Exception("Django 500 test — ignore once log file appears")

urlpatterns = [
    # test endpoint – hit it once, then remove
    path("__force_error__/", force_error, name="force-error"),

    path("items/", ItemListCreateView.as_view(), name="item-list"),
    # re_path(r"^items/?$", ItemListCreateView.as_view(), name="item-list"),
    path("", include(router.urls)),
]

__all__ = ["router", "urlpatterns"]
