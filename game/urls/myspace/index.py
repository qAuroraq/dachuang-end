from django.urls import path
from game.views.myspace.getinfo import InfoView
from game.views.myspace.buygoods import buygoods
from game.views.myspace.product import ProductView

urlpatterns = [
    path("getinfo/", InfoView.as_view(), name="myspace_getinfo"),
    path("buygoods/", buygoods, name="myspace_buygoods"),
    path("product/", ProductView.as_view(), name="myspace_product")
]

