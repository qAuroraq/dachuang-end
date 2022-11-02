from django.urls import path
from game.views.myspace.getinfo import InfoView
from game.views.myspace.buygoods import buygoods
from game.views.myspace.product import ProductView
from game.views.myspace.sanshui_api import XuperchainView
from game.views.myspace.transfer import TransferView
from game.views.myspace.queryhash import QueryView

urlpatterns = [
    path("getinfo/", InfoView.as_view(), name="myspace_getinfo"),
    path("buygoods/", buygoods, name="myspace_buygoods"),
    path("product/", ProductView.as_view(), name="myspace_product"),
    path("uploadchain/", XuperchainView.as_view(), name="myspace_upload"),
    path("transfer/", TransferView.as_view(), name="myspace_transfer"),
    path("query/", QueryView.as_view(), name="myspace_query"),
]

