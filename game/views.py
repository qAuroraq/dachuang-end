from django.http import HttpResponse

def index(request):
    line = '<h1 style="text-align: center">开始</h1>'
    line2 = '<img src="https://img2.baidu.com/it/u=2532177699,3005981499&fm=253&fmt=auto&app=120&f=PNG?w=640&h=433">'
    return HttpResponse(line + line2)
