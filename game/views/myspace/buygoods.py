from game.models.player.player import Player
from game.models.product.product import Product
from django.http import JsonResponse

def buygoods(request):
    user_id = request.GET.get('user_id', "").strip()
    price = request.GET.get('price')
    price = eval(price)
    product_name = request.GET.get('product_name',"").strip()
    player = Player.objects.get(user_id=user_id)
    balance = eval(player.balance)
    remain = balance - price
    if remain >= 0:
        player.balance = str(remain)
        player.save()
        Product.objects.create(user_id=user_id, product_name=product_name)
        return JsonResponse({
            'result': "success",
        })
    else:
        return JsonResponse({
            'result': "faild",
        })


    
