import os
from rest_framework.views import APIView
from rest_framework.response import Response

XUPERCHAIN_DIR = '../xuperchain/output'
BACK_DIR = '../../acapp'

def goto_place(path):
    os.chdir(path)

def write_terminal(input1):
    return os.popen(input1).read()

class QueryView(APIView):
    def get(self, request):
        goto_place(XUPERCHAIN_DIR)
        data = request.GET
        hashcode = data.get('hashcode')
        input1 = "bin/xchain-cli tx query " + hashcode + " -H 127.0.0.1:37101"
        output = write_terminal(input1)
        goto_place(BACK_DIR)
        #print("now is " + os.getcwd())
        return Response(output)
