class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        </br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        </br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出
        </div>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings_mode = this.$menu.find('.ac-game-menu-field-item-settings');
        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("!!!");
        });
        this.$settings_mode.click(function(){
            console.log("???");
            outer.root.settings.logout_on_remote();
        });
    }

    show()  //显示menu界面
    {
        this.$menu.show();
    }

    hide()  //关闭menu界面
    {
        this.$menu.hide();
    }
}
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
class GameMap extends AcGameObject{
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext("2d");
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start(){
    }

    update(){
        this.render();
    }

    render(){
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class Particle extends AcGameObject{
    constructor(playground, x, y, vx, vy, color, speed, radius, move_length){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.radius = radius;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 0.1;
    }

    start(){
    }

    update(){
        if(this.speed < this.eps || this.move_length < this.eps){
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends AcGameObject{
//speed 表示每秒钟移动百分之多少
    constructor(playground, x, y, radius, color, speed, is_me){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.spent_time = 0;

        this.cur_skill = null;

        if(this.is_me){
            this.img = new Image()
            this.img.src = this.playground.root.settings.photo
        }
    }

    start(){
        if(this.is_me){
            this.add_listening_events();
        }
        else{
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx,ty);
        }
    }

    add_listening_events(){
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3)
            {
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            }
            else if(e.which === 1){
                if(outer.cur_skill === "FireBall"){
                    outer.shoot_FireBall(e.clientX - rect.left, e.clientY - rect.top);
                }
            }
        });

        $(window).keydown(function(e){
            if(e.which === 81)
                outer.cur_skill = "FireBall";
                return false;
        });
    }

    shoot_FireBall(tx, ty){
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height;
        let damage = this.playground.height * 0.01;
        new FireBall(this.playground, this, x, y, radius, color, speed, vx, vy, move_length, damage);
        this.cur_skill = null;
    }

    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty){
       this.move_length = this.get_dist(this.x, this.y, tx, ty);
       let angle = Math.atan2(ty - this.y, tx - this.x);
       this.vx = Math.cos(angle);
       this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage){
        //击中就有效果
        for(let i = 0; i < 15 + Math.random() * 6; i ++ ){
            let x = this.x, y = this.y;
            let radius = this.radius * Math.max(0.05,0.2 * Math.random());
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, vx, vy, color, speed, radius,    move_length);
        }

        this.radius -= damage;
        if(this.radius < this.eps){
            this.destroy();
            return false;
        }
        else{
            this.damage_x = Math.cos(angle);
            this.damage_y = Math.sin(angle);
            this.damage_speed = damage * 100;
            this.speed *= 1.2;
            if(this.is_me)  this.speed *= 1.5;
        }
    }

    update(){
        this.spent_time += this.timedelta / 1000;
        if(Math.random() <= 1 / 200 && this.spent_time > 5){
            let player = this.playground.players[0];
            if(!this.is_me) this.shoot_FireBall(player.x, player.y);
        }
        if(this.damage_speed > 10){
            this.move_length = 0;
            this.vx = this.vy = 0;
            let moved = this.damage_speed * this.timedelta / 1000;
            this.x += this.damage_x * moved;
            this.y += this.damage_y * moved;
            this.damage_speed *= this.friction;
        }
        else{
            if(this.move_length < this.eps){        //误差判断
                this.move_length = 0;
                this.vx = this.vy = 0;
                if(!this.is_me){
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            }
            else{
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render(){
        if(this.is_me){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }
        else{
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }
}
class FireBall extends AcGameObject{
    //传player的原因是需要用于计分以及自己的技能不能误伤自己
    constructor(playground, player, x, y, radius, color, speed, vx, vy, move_length, damage){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start(){
    }

    update(){
        if(this.move_length < this.eps)
        {
            this.destroy();
            return false;
        }
        else{
            let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
            for(let i = 0; i < this.playground.players.length; i ++ ){
                let player = this.playground.players[i];
                if(this.player !== player && this.is_collision(player)){
                    this.attack(player);
                }
            }
        }
        this.render();
    }

    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(obj){
         let distance = this.get_dist(this.x, this.y, obj.x, obj.y);
         if(distance <= this.radius + obj.radius){
             return true;
         }
        return false;
    }

    attack(player){
        //注意方向
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.hide();
        this.start();
    }
    start(){
    }

    get_random_color(){
        let colors = ["yellow", "purple", "red", "blue", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }
    show()  //打开playground界面
    {
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        //必须写在下面的东西前面，否则100%没有效果,height=0
        this.height = this.$playground.height();
        this.width = this.$playground.width();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        for(let i = 0; i < 5; i ++ ){
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }

    }

    hide()  //关闭playground界面
    {
        this.$playground.hide();
    }
}
class Settings{
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS)  this.platform = "ACAPP";
        this.username = "";
        this.photo = "";
        this.User_id = 0;
        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error_message">
        </div>
        <div class="ac-game-settings-options">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="http://43.138.30.253:8000/static/img/settings/acwing_logo.png">
            <br>
            <div>Acwing一键登录</div>
        </div>
   </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error_message">
        </div>
        <div class="ac-game-settings-options">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="http://43.138.30.253:8000/static/img/settings/acwing_logo.png">
            <br>
            <div>Acwing一键登录</div>
        </div>
   </div>
</div>`
);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error_message");
        this.$login_options = this.$login.find(".ac-game-settings-options")
        this.$login.hide();
        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_confirm_password = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find('.ac-game-settings-error_message');
        this.$register_options = this.$register.find('.ac-game-settings-options');
        this.$register.hide();
        this.root.$ac_game.append(this.$settings);
        this.start();
    }

    start(){
        this.getinfo();
        this.add_listening_events();
    }

    add_listening_events(){
        this.add_listening_events_login();
        this.add_listening_events_register();
    }

    add_listening_events_login(){
        let outer = this;
        this.$login_options.click(function(){
            outer.register();
        })

        this.$login_submit.click(function(){
            outer.login_on_remote();
        })
    }

    add_listening_events_register(){
        let outer = this;
        this.$register_options.click(function(){
            outer.login();
        })
        this.$register_submit.click(function(){
            outer.register_on_remote();
        })
    }
    
    login_on_remote(){      //在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url: "http://43.138.30.253:8000/settings/login/",
            type: "GET",
            data:{
                'username': username,
                'password': password,
            },
            success: function(resp){
                console.log(resp);
                if(resp.result === 'success'){
                    location.reload();      //刷新
                }
                else{
                    outer.$login_error_message.html(resp.result);
                }
            }

        })

    }

    register_on_remote(){   //在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let confirm_password = this.$register_confirm_password.val();
        this.$register_error_message.empty();
        $.ajax({
            url: "http://43.138.30.253:8000/settings/register/",
            type: "GET",
            data: {
                'username': username,
                'password': password,
                'confirm_password': confirm_password,
            },
            success: function(resp){
                console.log(resp);
                if(resp.result === 'success'){
                    location.reload();  //刷新进入登录状态
                }else{
                    outer.$register_error_message.html(resp.result);
                }
            }
        })
    }

    logout_on_remote(){   //退出登录
        if(this.platform === 'ACAPP') return false;
        $.ajax({
            url: "http://43.138.30.253:8000/settings/logout/",
            type: "GET",
            success: function(resp){
                console.log(resp);
                if(resp.result === "success"){
                    location.reload();
                }
            }
        })
    }

    register(){     //打开注册页面
        this.$login.hide();
        this.$register.show();
    }

    login(){        //打开登录页面
        this.$register.hide();
        this.$login.show();
    }

    hide(){
        this.$settings.hide();
    }

    show(){
        this.$settings.show();
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
                console.log(resp)
                if(resp.result === "success"){
                    outer.username = resp.username
                    outer.photo = resp.photo
                    outer.user_id = resp.user_id
                    outer.hide();
                    outer.root.menu.show();
                }else{
                    outer.login();  //此时的this是本对象,不是根对象
                }
            }
        })
    }
}
export class AcGame {
    constructor(id, AcWingOS){
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;
        this.settings = new Settings(this)
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }
    start(){
    }
}
