class Settings{
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS)  this.platform = "ACAPP";
        this.start();
    }

    start(){
        this.getinfo();
    }

    register(){     //打开注册页面
    }

    login(){        //打开登录页面
    }

    hide(){
    }

    show(){
    }

    getinfo(){
        let outer = this;
        $.ajax({
            url:"http://43.138.30.253:8000/settings/getinfo/",
            type:"GET",
            data: {
               'platform':outer.platform,
            },
            success: function(resp){
                console.log(resp);
                if(resp.result === "success"){
                    outer.hide();
                    outer.root.menu.show();
                }else{
                    console.log("!!!");
                }
            }
        })
    }
}
