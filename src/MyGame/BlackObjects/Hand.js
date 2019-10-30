/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global GameObject, gEngine */

"use strict";

function Hand() {
    this.card = new GameObjectSet();
    this.numCard = 0;
    this.isFull = false;
    this.sum = 0;
};

/** 接受牌
   @param {int} i 通过对i取13的余数判断牌面的大小
   @param {boolean} d 明牌或暗牌
   每次收到牌都要把牌在界面上显示一下
 */

Hand.prototype.receiveCard = function(i, d, t, tt, atX, atY) {
    if(i % 13 === 0){
        this.card.addToSet(new Card(t, tt, atX, atY, 1, false, true, d)); // this card is an ace
        this.sum = this.sum + 1;
    }
    else if(i % 13 === 10 || i % 13 === 11 || i % 13 === 12){
        this.card.addToSet(new Card(t, tt, atX, atY, 10, true, false, d)); // this card is a face
    }
    else{
        this.card.addToSet(new Card(t, tt, atX, atY, i % 13+1, false, false, d)); // this card is a number
    }
    this.numCard = this.numCard + 1;
    
};

/** 是否为 BlackJack */
Hand.prototype.isBJ = function() {
    return sum === 21 && numCard === 2;
};

/** 获取当前Hand中所有牌的牌面总和 */
Hand.prototype.getSum = function () {
    var sum = 0;
    for(var i = 0; i < this.card.size(); i++) {
        sum = sum + this.card.getObjectAt(i).getValue();
    }
    return sum;
};

Hand.prototype.getAsum = function(){
    var sum = 0;
    var flag = false;
    for(var i = 0; i < this.card.size(); i++) {
        sum = sum + this.card.getObjectAt(i).getValue();
        console.log("value"+this.card.getObjectAt(i).getValue());
        if(this.card.getObjectAt(i).isAce()){
            flag = true;
        }
    }
    if(sum < 21 && flag){
        if(sum+10 <= 21){
            return sum+10;
        }
    }
    return sum;
};

Hand.prototype.draw = function (aCamera){
    this.card.draw(aCamera);
};

Hand.prototype.update = function (){
    this.card.update();
};