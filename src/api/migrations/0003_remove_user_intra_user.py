# Generated by Django 3.2.25 on 2024-06-02 12:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20240601_1051'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='intra_user',
        ),
    ]
