/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global GameObject, gEngine */

"use strict";

function Dealer() {
    this.hand = new Hand();
}

Dealer.prototype.showCard = function() {
    for(var i = 0;i < this.hand.card.size();i++){
        this.hand.card.getObjectAt(i).show();
    }
};

Dealer.prototype.update = function (){
    this.hand.update();
};