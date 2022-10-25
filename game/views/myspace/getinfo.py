from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player

class InfoView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user         #当前用户的信息
        user_id = int(request.GET.get('user_id', 1))
        player = Player.objects.get(user_id=user_id)
        return Response({
            'user_id': user.id,
            'username': user.username,
            'balance': player.balance,
            'photo': player.photo,
            })
