from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    imageGenre =  models.URLField(default="https://media.istockphoto.com/id/1097738078/pl/zdj%C4%99cie/r%C4%99ka-naukowca-trzymaj%C4%85cego-kolb%C4%99-ze-szklanymi-naczyniami-laboratoryjnymi-w-tle-laboratorium.jpg?s=2048x2048&w=is&k=20&c=SkjOYLc7qD-GukqKoswQpRHmxIePOqdi51RNbhwmvtg=",max_length=400)  
    def __str__(self):
        return self.name
class Author(models.Model):
    name = models.CharField(max_length=100, unique=True)
    imageAuthor =  models.URLField(default="https://media.istockphoto.com/id/1327592506/pl/wektor/domy%C5%9Blna-ikona-symbolu-zast%C4%99pczego-zdj%C4%99cia-awatara-szare-zdj%C4%99cie-profilowe-cz%C5%82owiek-biznesu.jpg?s=2048x2048&w=is&k=20&c=QzrDx-OsmsBkP3pB68zVo53u1cyxI5jeq2R5W4sV3fQ=",max_length=400) 
   

    def __str__(self):
        return self.name
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    image = models.URLField()  
    genre = models.ManyToManyField(Genre, related_name="books")
    pdf = models.FileField(upload_to='pdfs/')  

    def __str__(self):
        return self.title
    def read_count(self):
        return self.reads.count() 
    def favorite_count(self):
        return self.favorites.count()

class Read(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reads") 
    reader = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reads")  

    def __str__(self):
        return str(self.book)

class Favorite(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="favorites")  
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="favorites")  

    def __str__(self):
        return str(self.book)
