from django.urls import path
from .views import predict, home

urlpatterns = [
    path('', home, name='home'),  # Home page
    path('predict/', predict, name='predict'),  # API endpoint
]
