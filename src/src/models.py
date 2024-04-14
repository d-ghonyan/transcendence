# from django.db import models
# from django.conf import settings
# from django.contrib.auth.models import AbstractUser

# import os
# # from django.contrib.postgres.fields import ArrayField

# class User(AbstractUser):
# 	prof_pic = models.ImageField(default=(os.path.join(settings.BASE_DIR, "/media/default.jpg")))
# 	name = models.TextField(default="user", )
# 	username = models.TextField(default="user", unique=True)
# 	password = models.TextField(default="user", )
# 	# friends = ArrayField(User())
# 	wins = models.IntegerField(default=0)
# 	loses = models.IntegerField(default=0)
# 	# match_history = ArrayField(Match())

# class Match(models.Model):
# 	player1_id = models.IntegerField(default=1)
# 	player2_id = models.IntegerField(default=1)
# 	winner_id = models.IntegerField(default=1)

# class ChatMessages(models.Model):
# 	sender_id =  models.IntegerField(default=1)
# 	receiver_id =  models.IntegerField(default=1)
# 	name = models.TextField(default="", )
