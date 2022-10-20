from django.http import JsonResponse
from game.models.player.player import Player
from django.contrib import auth

def getinfo_acapp(request):
    player = Player.objects.all()[0];
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo,
    })


def getinfo_web(request):
    #username = request.GET.get("username")
    #password = request.GET.get("password")
    #auth_obj = auth.authenticate(request, username=username, password=password)
    #if auth_obj:
        # 需要auth验证cookie
        #auth.login(request, auth_obj)
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录",
        })
    else:
        player = Player.objects.get(user=user);
        return JsonResponse(
        {
            'result': "success",
            'username': player.user.username,
            'photo': player.photo,
            'user_id': player.id,
        })

def getinfo(request):
    platform = request.GET.get('platform');
    if platform == "ACAPP":
        return getinfo_acapp(request)
    elif platform == "WEB":
        return getinfo_web(request)

