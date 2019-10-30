/*
 * File: EngineCore.js 
 * The first iteration of what the core of our game engine would look like.
 */
/*jslint node: true, vars: true, evil: true, bitwise: true */
/*global document */
/* find out more about jslint: http://www.jslint.com/help.html */

//  Global variable EngineCore
//  the following syntax enforces there can only be one instance of EngineCore object
"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Static refrence to gEngine
 * @type gEngine
 */
var gEngine = gEngine || {};
// initialize the variable while ensuring it is not redefined

gEngine.Mine = (function () {


    var incDeath = function () {
        gEngine.Mine.death += 1;
        var a = document.getElementById("DeathNum");
        a.innerHTML = "Death: " + gEngine.Mine.death;
    };

    var timeStart = function () {
        if (!gEngine.Mine.gameStatus.start) {
            gEngine.Mine.startTime = (new Date()).getTime();
            gEngine.Mine.gameStatus.start = true;
        }
        console.log(gEngine.Mine.startTime);
    };

    var timeSpend = function () {
        if (!gEngine.Mine.gameStatus.finish && gEngine.Mine.gameStatus.start) {
            var now = (new Date()).getTime();
            //console.log(now);
            gEngine.Mine.spendTime = ((now - gEngine.Mine.startTime) / 1000).toFixed(2);
            var a = document.getElementById("Time");
            a.innerHTML = "Time: " + gEngine.Mine.spendTime;
        }
    };
    var setZero = function (){
        gEngine.Mine.gameStatus.finish = true;
        gEngine.Mine.spendTime = (0).toFixed(2);
        var a = document.getElementById("Time");
        a.innerHTML = "Time: " + gEngine.Mine.spendTime;
    };
    var reStart = function(){
        gEngine.Mine.gameStatus.start = false;
        gEngine.Mine.gameStatus.finish = false;
        gEngine.Mine.spendTime = (0).toFixed(2);
    };
    var tipDisappear = function () {
        document.getElementById("Tip").innerHTML = "";
    };

    var tipAppear = function () {
        document.getElementById("Tip").innerHTML = "Press CTRL to skip";
    };
    
    var getVariable = function (){
        gEngine.Mine.bet = document.getElementById("bet").value;
        gEngine.Mine.hand = document.getElementById("hand").value;
        
    };

    var mPublic = {
        incDeath: incDeath,
        timeStart: timeStart,
        timeSpend: timeSpend,
        setZero: setZero,
        reStart: reStart,
        tipDisappear: tipDisappear,
        tipAppear: tipAppear,
        getVariable: getVariable,
        saveStatus: {
            tribleJump: false,
            finishFirst: false,
            finishSecond: false
        },
        gameStatus: {
            start: false,
            finish: false
        },
        bet: 0,
        hand: 0,
        velocity: new Array(),
        position: new Array(),
        startTime: null,
        spendTime: 0,
        death: 0,
        restartLevel: () => new FirstLevel(),
        v: 0,
        curDirection: 0,
        allTimeSpent: new Array(),
    };

    return mPublic;
}());
