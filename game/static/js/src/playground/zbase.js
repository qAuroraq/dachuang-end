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
