/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global GameObject, gEngine */

"use strict";

function Deck(tt) {
    this.sortedCards = Array.from({length:52}, (v,k) => k); // [0,52)
    console.log(this.sortedCards);
    this.cur = 0;
    this.fakeCard = new Card(null, tt, -500, 240,0, false, false, true); //只是用来展现动画效果的假牌与实际游戏无关
}

/** 随机排序的排序函数*/
function randomSort(a, b) {
    return Math.random() > 0.5 ? -1 : 1;
};

/** 洗牌 */
Deck.prototype.shuffle = function () {
    this.sortedCards.sort(randomSort);
    //console.log("shuffled card: " + this.sortedCards);
};

/** Deck 发出剩余牌堆的第一张牌，用一个0-51的数字唯一表示牌 */
Deck.prototype.sendCard = function(t) {
    this.fakeCard.move(t); //t表示发牌的对象，用来控制动画效果，卡牌的移动方向
    //console.log("send card: " + this.cur);
    this.cur = this.cur + 1;
    return this.sortedCards[this.cur];
};

Deck.prototype.recover = function(){
    this.fakeCard.recover();
};

Deck.prototype.isSendOver = function(){
    //console.log(this.fakeCard.isSendOver());
    return this.fakeCard.isSendOver();
};

Deck.prototype.draw = function(acamera){
    this.fakeCard.draw(acamera);
};

Deck.prototype.update = function(){
    this.fakeCard.update();
};