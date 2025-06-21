from django.urls import include, path
from blogapi.urls import router    # wherever your DRF router lives
urlpatterns = [path('', include(router.urls))]
