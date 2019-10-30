/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global GameObject, gEngine, SpriteObj */

"use strict";

function Card(t, tt, atX , atY, value, isFace, isAce, isDark) {
    this.kT = tt;
    this.mCard = new TextureRenderable(tt); //tt是明牌需要映射的纹理
    if(!isDark){
        this.mCard.setTexture(t); //t是暗牌需要映射的纹理
    }
    this.mCard.setColor([1, 1, 1, 0]);
    this.mCard.getXform().setPosition(atX, atY);
    this.mCard.getXform().setSize(46, 64);
    
    GameObject.call(this, this.mCard);
    
    this.value = value;

    /* 是否为King，Queen，Jack */
    this.isFace = isFace;

    /* 是否为Ace */
    this.ismAce = isAce; // value could be 1 or 11

    /* 牌面是否向下 */
    this.isDark = isDark;
    
    /* 是否需要出示牌 */
    this.isShow = false;
    
    /* 牌是否要移动 */
    this.isMove = false;
    
    /* 牌是否需要复原 */
    this.isRecover = false;
    
    /* 发牌的对象 */
    this.toWhom = -1; //0表示玩家，1表示庄家
    
    /* 发牌的动画效果是否已经结束 */
    this.sendOver = false;
    //上面三个变量都由赌桌进行操控，因为赌桌负责发牌的
}
gEngine.Core.inheritPrototype(Card, GameObject);

//发牌的时候ismove置为true，该方法只针对需要做动画效果的牌
Card.prototype.move = function(t) {
    this.toWhom = t;
    this.isMove = true;  
};
//发牌的动画效果是否已经结束
Card.prototype.isSendOver = function(){
    //console.log(this.sendOver);
    return this.sendOver;
};
//牌是否需要复原
Card.prototype.recover = function(){
    this.isRecover = true;
};
//展现牌
Card.prototype.show = function(){
    this.isShow = true;
};

Card.prototype.getValue = function() {
    return this.value;
};

Card.prototype.isFace = function() {
    return this.isFace;
};

Card.prototype.isAce = function() {
    return this.ismAce;
};

Card.prototype.isDark = function() {
    return this.isDark;
};

Card.prototype.draw = function (acamera){
    GameObject.prototype.draw.call(this, acamera);
};
//更新card,展现动画效果
Card.prototype.update = function () {
    //SpriteObj.prototype.update.call(this);
    
    var xf = this.getXform(); //得到牌的Transform对象
    //发牌给玩家
    if(this.toWhom === 0){
        //若开始移动且没有移动到指定位置，每帧下降10PX
        if (this.isMove && xf.getYPos() >= -200) {
            xf.incYPosBy(-4);
            
        }
        //如果移动到指定位置了就消失，发牌动画效果结束
        if (xf.getYPos() < -200){
            this.setVisibility(false);
            this.sendOver = true;
            this.isMove = false;
        }
    }else if(this.toWhom === 1){
        //若开始移动且没有移动到指定位置，每帧向右10PX
        if (this.isMove && xf.getXPos() <= -100) {
            xf.incXPosBy(4);
        }
        //如果移动到指定位置了就消失，发牌动画效果结束
        if (xf.getXPos() > -100){
            this.setVisibility(false);
            this.sendOver = true;
            this.isMove = false;
        }
    }
    
    //如果需要复原，则改变牌的坐标并且修改可见性为true
    if(this.isRecover){
        this.isRecover = false;
        xf.setYPos(240);
        xf.setXPos(-500);
        this.sendOver = false;
        this.setVisibility(true); 
    }
    if(this.isShow){
        
        this.mCard.setTexture(this.kT);
    }
    
};