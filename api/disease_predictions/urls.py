from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",include('predictor.urls')),
    path('api/', include('predictor.urls')),  # ✅ Connect the app
]
