# Generated by Django 5.1.2 on 2024-10-29 08:26

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library', '0003_genre_remove_book_genre_book_genre'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reservation',
            name='book',
        ),
        migrations.RemoveField(
            model_name='reservation',
            name='user',
        ),
        migrations.RemoveField(
            model_name='book',
            name='ISBN',
        ),
        migrations.RemoveField(
            model_name='book',
            name='quantity',
        ),
        migrations.AddField(
            model_name='book',
            name='image',
            field=models.URLField(default=datetime.datetime(2024, 10, 29, 8, 25, 7, 557701, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='book',
            name='pdf',
            field=models.FileField(default=datetime.datetime(2024, 10, 29, 8, 26, 33, 260204, tzinfo=datetime.timezone.utc), upload_to='pdfs/'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='library.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Read',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reads', to='library.book')),
                ('reader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reads', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='Loan',
        ),
        migrations.DeleteModel(
            name='Reservation',
        ),
    ]
