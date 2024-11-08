
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.filters import SearchFilter
from django.db import IntegrityError
from django.http import *
from django.shortcuts import *
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from .models import *
from .serializers import *
from rest_framework import viewsets, status,generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView

def index(request):
    

    if(request.user.is_authenticated):
        if(request.user.is_admin):
            return render(request,'library/admin.html')
        else:
            return render(request,'library/index.html')
    else:
        return render(request,'library/login.html')
  
    
    
def login_view(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password=request.POST["password"]
        user= authenticate(request,username = username,password=password)
        
        if (user):
            login(request,user)
            return redirect('index')
        else:
              return render(
                request,
                "library/register.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request,'library/login.html')
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))
            
def register(request):
    if request.method == 'POST':
        fullN  = request.POST["full-name"]
        email = request.POST["email"]
        username = request.POST["username"]
        password=request.POST["password"]
        user = CustomUser.objects.create_user(username,email,password,full_name=fullN)
        
        user.save()
        return redirect('index')
    else:
        return render(request,'library/register.html')
def check_username(request):
    username = request.GET.get('username',None)
    if username:
        exist = CustomUser.objects.filter(username=username).exists()
        return JsonResponse({'exist':exist})
    return JsonResponse({'exist':'not'})

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'author__name','genre__name']
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def allBooks(self, request):
        try:
            books = Book.objects.all()
            serializer = self.get_serializer(books, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)  
            return Response({"error": str(e)}, status=500)  
        
    @action(detail=True, methods=['get'])
    def bookDetails(self,request,pk=None):
        book = get_object_or_404(Book,id = pk)
        try:
            serializer = self.get_serializer(book)
            return Response(serializer.data)
        except Exception as e :
             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
         
    @action(detail=False , methods=['get'],url_path='genre/(?P<genre>[^/.]+)')
    def booksGenre(self,request,genre=None):
        try:
            books= self.queryset.filter(genre__name__iexact = genre)
            serializer = self.get_serializer(books,many = True)
            return Response(serializer.data)
        except Exception as e :
             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
         
   
    @action(detail=True, methods=['put'],url_path='update' )
    def updateBook(self,request,pk=None):
        book = get_object_or_404(Book, id=pk)
        serializer = self.get_serializer(book, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GenreApi(APIView):
 
    def put(self, request, pk, format=None):
        genre = get_object_or_404(Genre, id=pk)
        serializer =GenreSerializer(genre, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
class GenreDetailView(generics.RetrieveAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    lookup_field = 'id'

class AuthorListView(generics.ListAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class AuthorDetailView(generics.RetrieveAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    lookup_field = 'id'


    