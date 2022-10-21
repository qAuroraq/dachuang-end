from django.http import JsonResponse
from game.models.player.player import Player

def getinfo(request):
    user_id = int(request.GET.get('user_id', 1))
    player = Player.objects.get(user_id=user_id)
    return JsonResponse({
        'user_id': player.user.id,
        'username': player.user.username,
        'balance': player.balance,
        'photo': player.photo,
        })
