from django.urls import path
from .views import predict, home, get_medicines

urlpatterns = [
    path('', home, name='home'),  # Home page
    path('api/predict/', predict, name='predict'),
    path('api/medicines/', get_medicines, name='get_medicines'),  # API endpoint
]
