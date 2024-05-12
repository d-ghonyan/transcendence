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

class AuthMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.protected_routes = [
			'/game',
			'/home',
		]

	def __call__(self, request):
		# Code to be executed for each request before
		# the view (and later middleware) are called.

		# if (request.path == '/login'):
		return self.get_response(request)


		# return None
		# if (request.path in self.protected_routes):
			# token = 

		# Code to be executed for each request/response after
		# the view is called.