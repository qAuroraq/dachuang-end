let AC_GAME_OBJECTS = [];       //定义全局变量存当前在游戏界面的内容

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);     //将当前对象放入容器

        this.has_called_start = false;  //是否执行过start函数
        this.timedelta = 0;             //存储当前帧和上一帧之间的时间间隔
    }

    start(){                //只会在第一帧执行，用于初始化一些变量
    }

    update(){               //每一帧都会执行
    }

    on_destroy(){           //在被销毁前执行一次，用于恢复现场
    }

    destroy(){                      //从对象数组中删去即可
        this.on_destroy();
        for(let i = 0; i < AC_GAME_OBJECTS.length; i ++ ){
            if(AC_GAME_OBJECTS[i] === this){
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp){
    for(let i = 0; i < AC_GAME_OBJECTS.length; i ++ ){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }
        else{
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
