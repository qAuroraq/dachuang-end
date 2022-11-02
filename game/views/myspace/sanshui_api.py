import os
from rest_framework.views import APIView
from rest_framework.response import Response

XUPERCHAIN_DIR = '../xuperchain/output'
#OUTPUT_DIR = './xuperchain/output'
BACK_DIR = '../../../../acapp'

sample_dic = {
    'name':'testuser',
    'amount':100,
    'address':'None',
    'dir':'None'
}

def write_terminal(input1):
    return os.popen(input1).read()

def goto_place(path):
    os.chdir(path)

def start_blockchain():
    goto_place(XUPERCHAIN_DIR)
    commond = "bash control.sh start"
    write_terminal(commond)
    satus = write_terminal("bin/xchain-cli status -H 127.0.0.1:37101")
    goto_place('../../acapp')
    return satus


class XuperchainView(APIView):
    def get(self,request):
        data = request.GET
        #self.name = init_dic['name']
        start_blockchain()
        self.name = data.get('username')
        self.dir = 'data/'+self.name+'/'
        #self.amount  = init_dic['amount']
        self.amount = data.get('amount')
        self.address = 'Not yet update'
        self.update_init()
        self.transfer(self.address, self.amount)
        return Response('success')

    def update_init(self):
        goto_place(XUPERCHAIN_DIR)
        #para = [OUTPUT_DIR,"bin/xchain-cli account newkeys --output",OUTPUT_DIR,"data/" + self.name]
        #input1 = ' '.join(para)
        input1 = "./bin/xchain-cli account newkeys --output data/" + self.name
        output = write_terminal(input1)
        os.chdir(os.path.join(os.getcwd(),'data',self.name))
        with open('address','r') as f:
            address = f.read()
            self.address = address
        #print("account " + self.name + " address is "+ self.address)
        goto_place(BACK_DIR)
        return output

    def transfer(self,target_address,amount):
        goto_place(XUPERCHAIN_DIR)
        input1 = "bin/xchain-cli transfer --to " + target_address + " --amount " + str(amount) + " --keys data/keys/ -H 127.0.0.1:37101"
        #self_dir = os.path.join('data',self.name)
        #para = [OUTPUT_DIR,"bin/xchain-cli transfer --to", target_address, '--amount', str(amount) ,"--keys ",self.dir, "-H 127.0.0.1:37101"]
        #input = ' '.join(para)
        #传参到区块链
        output = write_terminal(input1)
        goto_place('../../acapp')
        return output

    def update(self):
        goto_place(XUPERCHAIN_DIR)
        #查询区块链
        #bin/xchain-cli account balance --keys data/bob -H 127.0.0.1:37101
        #para = [OUTPUT_DIR,"bin/xchain-cli account balance --keys",self.dir,"-H 127.0.0.1:37101"]
        input1 = "bin/xchain-cli account balance --keys " + self.dir + " -H 127.0.0.1:37101"
        output = write_terminal(input1)
        self.amount = output
        goto_place('../../acapp')
        return output

    def check_account(self):
        self.update()
        return self.amount 

    def start_blockchain():
        goto_place(XUPERCHAIN_DIR)
        commond = "bash control.sh start"
        write_terminal(commond)
        satus = write_terminal("bin/xchain-cli status -H 127.0.0.1:37101")
        goto_place('../../acapp')
        return satus

#def main():
    #goto_place(ROOT_DIR)
    #du_dic = {
    #'name':'du',
    #'amount':100,
    #'address':'None',
    #'dir':'None'
    #}
    #gu_dic = {
    #'name':'gu',
    #'amount':100,
    #'address':'None',
    #'dir':'None'
    #}
    #print(start_blockchain())
    #du = Xuper_account(du_dic)
    #gu = Xuper_account(gu_dic)
    #print(du.transfer(gu.address,10))
    #gu.check_account()
    #print(gu.amount)

#if __name__ == '__main__':
    #main()
