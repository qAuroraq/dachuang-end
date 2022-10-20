from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def register(request):
    data = request.GET
    username = data.get("username", "").strip();
    password = data.get("password", "").strip();
    password_confirm = data.get("confirm_password", "").strip();
    if not username or not password:
        return JsonResponse({
            'result': "用户名或密码为空",
        })
    if not password_confirm:
        return JsonResponse({
            'result': "请输入确认密码",
        })
    if password != password_confirm:
        return JsonResponse({
            'result': "两次密码不一致",
        })
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': "用户名已存在",
        })
    user = User(username=username)
    user.set_password(password)
    user.save()
    Player.objects.create(user=user, photo="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.616pic.com%2Fys_bnew_img%2F00%2F17%2F38%2Fez89bTi1r3.jpg&refer=http%3A%2F%2Fpic.616pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668858944&t=90c641e439ecfd96d5441ab1e3b193dc", balance="0")
    login(request, user)
    return JsonResponse({
        'result': "success",
    })
