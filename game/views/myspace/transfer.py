import os
from rest_framework.views import APIView
from rest_framework.response import Response
from game.models.player.player import Player
from game.models.product.product import Product

XUPERCHAIN_DIR = '../xuperchain/output'
BACK_DIR = '../../acapp'

def goto_place(path):
    os.chdir(path)

def write_terminal(input1):
    return os.popen(input1).read()

class TransferView(APIView):
    def get(self, request):
        target_address="YZRTjonyyGhhoyS3FHqdaZ6Yis9XzMY1A"
        #print("!!! " + os.getcwd())
        goto_place(XUPERCHAIN_DIR)
        data = request.GET
        amount = data.get('price')
        user_id = data.get('user_id')
        product_id = data.get('product_id')
        amount = eval(amount)
        player = Player.objects.get(user_id=user_id)
        product = Product.objects.get(pk=product_id)
        username = player.user.username
        input1 = "bin/xchain-cli transfer --to " + target_address + " --amount " + str(amount) + " --keys data/" + username + "/ -H 127.0.0.1:37101"
        #self_dir = os.path.join('data',self.name)
        #para = [OUTPUT_DIR,"bin/xchain-cli transfer --to", target_address, '--amount', str(amount) ,"--keys ",self.dir, "-H 127.0.0.1:37101"]
        output = write_terminal(input1)
        product.hashcode = output
        product.save()
        goto_place(BACK_DIR)
        #print("now is " + os.getcwd())
        return Response({
            'hashcode': output,
            })

