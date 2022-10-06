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
            设置
        </div>
    </div>
</div>
`);
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
            if(e.which === 3)
            {
                outer.move_to(e.clientX,e.clientY);
            }
            else if(e.which === 1){
                if(outer.cur_skill === "FireBall"){
                    outer.shoot_FireBall(e.clientX, e.clientY);
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
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
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
        // this.hide();
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
    }

    hide()  //关闭playground界面
    {
        this.$playground.hide();
    }
}
export class AcGame {
    constructor(id){
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }
    start()
    {}
}
