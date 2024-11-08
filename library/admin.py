from django.contrib import admin
from .models import *
admin.site.register(Book)
admin.site.register(CustomUser)
admin.site.register(Genre)
admin.site.register(Favorite)
admin.site.register(Author)

