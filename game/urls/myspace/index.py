from django.urls import path
from game.views.myspace.getinfo import getinfo
from game.views.myspace.buygoods import buygoods

urlpatterns = [
    path("getinfo/", getinfo, name="myspace_getinfo"),
    path("buygoods/", buygoods, name="myspace_buygoods")
]

