/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global GameObject, gEngine */

"use strict";

function Player(bet, numHand) {
    this.hand = new Array();
    for(var i = 0; i < numHand; i ++){
        this.hand.push(new Hand());
    }
    this.bet = bet;
}

Player.prototype.showCard = function() {
    // 展示所有牌
    // 展示牌的总和
};
/*
Player.prototype.calculateMoney = function() {
    var sum = 0;
    for(var i = 0; i < this.hand.size(); i ++){
        sum = sum + this.hand.getObjectAt(i).getValue();
    }
    return sum;
}; */