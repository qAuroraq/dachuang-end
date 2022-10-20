from django.http import JsonResponse

def getinfo(request):
    index = int(request.GET.get('user_id'))
    User = [{'id': 1, 'balance': 1000, 'position': 'Beijing', 'nickname': 'NN'},
            {'id': 2, 'balance': 1500, 'position': 'Shanghai', 'nickname': 'TT'},
            {'id': 3, 'balance': 2000, 'position': 'Kunming', 'nickname': 'ZZ'},
            {'id': 4, 'balance': 2500, 'position': 'Chongqing', 'nickname': 'PP'},
        ]
    player = User[index]
    print(player)
    return JsonResponse({
            'id': player['id'],
            'balance': player['balance'],
            'position': player['position'],
            'nickname': player['nickname'],
        })
