from django.urls import path
from game.views.myspace.getinfo import getinfo

urlpatterns = [
    path("getinfo/", getinfo, name="myspace_getinfo")
]

