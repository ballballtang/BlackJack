
/*
 * File: GameRoom3.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
 FontRenderable, SpriteRenderable, LineRenderable,
 GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameRoom() {
    
    //牌的贴图
    this.kCard = [];
    for(var i = 0; i <= 52; i++){
        this.kCard[i] = "assets/card/card" + i + ".png";
    }
    this.kWin = "assets/card/win.png";
    this.kLose = "assets/card/lose.png";

    // Camera
    this.mCamera = null;
    //玩家交互的按钮
    this.UIButton1 = null;
    this.UIButton2 = null;
    //游戏结束的图片
    this.mWin = null;
    this.mLose = null;
    
    //发牌的轮数，初始值为2
    this.mRound = 2 ; 
    this.numCard = 2;
    this.dealerRound = 2;
    //玩家目前手牌个数
    this.mHand = 0;
    //正在发牌
    this.isSending = false;
    this.mSend = true;
    //确认要牌
    this.mNew = false;
    //牌的下标
    this.mCard;
    //计时器
    this.mClock = 0;
    //获得的钱的数量
    this.mMoney = 0;
    //获取变量
    gEngine.Mine.getVariable();
    
    
}
gEngine.Core.inheritPrototype(GameRoom, Scene);

//加载图片资源
GameRoom.prototype.loadScene = function () {
    for(var i = 0; i <= 52; i++){
        gEngine.Textures.loadTexture(this.kCard[i]);
    }
    gEngine.Textures.loadTexture(this.kWin);
    gEngine.Textures.loadTexture(this.kLose);
};

//释放图片资源
GameRoom.prototype.unloadScene = function () {
    for(var i = 0; i <= 52; i++){
        gEngine.Textures.unloadTexture(this.kCard[i]);
    }
    gEngine.Textures.unloadTexture(this.kWin);
    gEngine.Textures.unloadTexture(this.kLose);
};
/* 初始化 */
GameRoom.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        1200, // width of camera
        [0, 0, 1200, 675]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.2, 0.5, 0.2, 1]);
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    

    this.mPlayer = new Player(gEngine.Mine.bet, gEngine.Mine.hand);  //从前端获取的变量（赌注和手牌个数），由玩家输入
    this.mDeck = new Deck(this.kCard[52]);
    this.mDealer = new Dealer();
    
    this.UIButton1 = new UIButton(this.newCard, this, [1000, 460], [150, 45], "NewCard", 24);
    this.UIButton2 = new UIButton(this.stand, this, [1000, 380], [150, 45], "Stand", 24);
    this.mWin = new Platform(this.kWin, 0, 0, 300, 300);
    this.mLose = new Platform(this.kLose, -50, 0, 300, 300);
    this.mWin.setVisibility(false);
    this.mLose.setVisibility(false);
    //洗牌
    this.mDeck.shuffle();
    
    //发一轮明牌
    var startX = -320; //玩家的第一手牌的第一张牌的坐标
    for(var i = 0; i < this.mPlayer.hand.length; i++){
        var a = this.mDeck.sendCard(); //牌的下标号
        console.log("Player: "+a);
        this.mPlayer.hand[i].receiveCard(a, true,this.kCard[52],this.kCard[a],startX+310*i,-200);
    }
    var b = this.mDeck.sendCard();
    console.log("Dealer: "+ b);
    this.mDealer.hand.receiveCard(b, true,this.kCard[52],this.kCard[b],-50,240);
    //发一轮暗牌（因为游戏界面是面向玩家的，所以玩家的牌都是明牌）
    for(var i = 0; i < this.mPlayer.hand.length; i++){
        var a = this.mDeck.sendCard(); //牌的下标号
        console.log("Player: "+a);
        this.mPlayer.hand[i].receiveCard(a, true,this.kCard[52],this.kCard[a],startX+310*i+30,-200);
    }
    var c = this.mDeck.sendCard();
    console.log("Dealer: "+ c);
    this.mDealer.hand.receiveCard(c, false,this.kCard[52],this.kCard[c],-20,240);
    
};

/* 显示UI上需要图形化的内容 */
GameRoom.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.UIButton1.draw(this.mCamera);
    this.UIButton2.draw(this.mCamera);

    this.mDeck.draw(this.mCamera);
    this.mDealer.hand.draw(this.mCamera);
    for(var i = 0; i < this.mPlayer.hand.length; i++){
        this.mPlayer.hand[i].draw(this.mCamera);
    }
    this.mWin.draw(this.mCamera);
    this.mLose.draw(this.mCamera);
};

//和图形化界面有关的update函数，每秒运行此函数60次
GameRoom.prototype.update = function () {

    //玩家要牌
    if(this.mNew){
        this.mNew = false;
        this.mCard = this.mDeck.sendCard(0);
        this.isSending = true;     
    }
    //等待发牌动画结束后显示获得的牌
    if(this.mDeck.isSendOver() && this.isSending && this.mHand !== 3){   
        this.mPlayer.hand[this.mHand].receiveCard(this.mCard, true,this.kCard[52],this.kCard[this.mCard],-320+30*this.numCard+310*this.mHand,-200);
        this.isSending = false;
        this.numCard += 1;
        this.mDeck.recover();
    }   
    //判断当前手牌五轮牌是否发完
    if(this.mRound === 5 && !this.isSending){
        this.numCard = 2;
        this.mRound = 2;
        this.mHand += 1;
    }

    //玩家的手牌发完
    if(this.mHand == gEngine.Mine.hand && this.dealerRound < 5){       
        if(this.mDealer.hand.getSum() < 17 && this.mSend){
            this.mSend = false;
            this.mCard = this.mDeck.sendCard(1);
            this.isSending = true;           
        }else if(this.mDealer.hand.getSum() >= 17){
            this.dealerRound += 1;
        }
        if(this.mDeck.isSendOver() && this.isSending){
            this.mDealer.hand.receiveCard(this.mCard, false,this.kCard[52],this.kCard[this.mCard],-50+30*this.numCard,240);
            this.isSending = false;
            this.numCard += 1;
            this.mDeck.recover();
            this.mSend = true;
            this.dealerRound += 1;
        }   
        
    }
    
    //游戏结束后显示牌，并计算输赢
    if(this.mHand == gEngine.Mine.hand && this.dealerRound === 5){
        this.mClock += 1;
        if(this.mClock > 100){   
            this.calculateMoney();
            this.mDealer.showCard();
            var a = document.getElementById("Money");
            a.innerHTML = "You have got: " + this.mMoney+" $";
            this.mHand += 1;
        }  
    }
    

    this.mDealer.update();
    this.mDeck.update();
    this.UIButton1.update();
    this.UIButton2.update();
    
    
};

//计算最后获得的钱
GameRoom.prototype.calculateMoney = function () {

    var a = this.mDealer.hand.getAsum();
    console.log(a);
    if(a < 21){
        for(var i = 0; i < gEngine.Mine.hand; i++){
            console.log(this.mPlayer.hand[i].getAsum());
            if(this.mPlayer.hand[i].getAsum() > a && this.mPlayer.hand[i].getAsum() <= 21){
                this.mMoney += 1;
            }else{
                if(this.mPlayer.hand[i].getAsum() != a){
                    this.mMoney -= 1;
                }
            }
        }
    }else if(a === 21){
        for(var i = 0; i < gEngine.Mine.hand; i++){
            console.log(this.mPlayer.hand[i].getAsum());
            if(this.mPlayer.hand[i].getAsum() !== 21){
                this.mMoney -= 1 ;
            }else if(this.mPlayer.hand[i].isBJ()){
                if(!this.mDealer.hand.isBJ()){
                    this.mMoney += 1;
                }
            }
        }
    }else{
        for(var i = 0; i < gEngine.Mine.hand; i++){
            console.log(this.mPlayer.hand[i].getAsum());
            if(this.mPlayer.hand[i].getAsum() <= 21){
                this.mMoney += 1 ;
            }
        }
    }
    this.mMoney = this.mMoney * gEngine.Mine.bet;
    if(this.mMoney > 0){
        this.mWin.setVisibility(true);
    }else{
        this.mLose.setVisibility(true);
    }
    console.log(this.mMoney);
};
//要牌按钮的函数
GameRoom.prototype.newCard = function () {
    this.mNew = true;
    this.mRound += 1;
};
//不要牌按钮的函数
GameRoom.prototype.stand = function () {
    this.mNew = false;
    this.mRound += 1;
};