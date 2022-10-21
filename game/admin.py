from django.contrib import admin
from game.models.player.player import Player
from game.models.product.product import Product

# Register your models here.

admin.site.register(Player)
admin.site.register(Product)
