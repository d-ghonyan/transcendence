from django.db import models
from django.conf import settings
import os
# from django.contrib.postgres.fields import ArrayField

class User(models.Model):
	prof_pic = models.ImageField(default=(os.path.join(settings.BASE_DIR, "/media/default.jpg")))
	name = models.CharField(default="user", max_length=50)
	username = models.CharField(default="user", max_length=20)
	password = models.CharField(default="user", max_length=20)
	# friends = ArrayField(User())
	wins = models.IntegerField(default=1)
	loses = models.IntegerField(default=1)
	# match_history = ArrayField(Match())

class Match(models.Model):
	user_1 = models.OneToOneField(User, on_delete=models.CASCADE);