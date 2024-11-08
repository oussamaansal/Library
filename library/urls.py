from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . views import *
from . import views

# Initialize a router for viewsets
router = DefaultRouter()
router.register(r'books', BookViewSet )


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
     path("register", views.register, name="register"),
     path("logout", views.logout_view, name="logout"),

     #API
     path("check-username/", views.check_username, name="check_username "),
     path('genres/', GenreListView.as_view(), name='genreList'),
     path('authors/', AuthorListView.as_view(), name='authorsList'),
     path('genres/<int:id>/', GenreDetailView.as_view(), name='genre-detail'),
     path('authors/<int:id>/', AuthorDetailView.as_view(), name='author-detail'),
     path('api/genres/<int:pk>/', views.GenreApi.as_view(), name='genreApi'),
     path('api/',include(router.urls))
]
