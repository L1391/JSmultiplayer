import {Renderer} from 'lance-gg';
import Player from './../common/Player';
import Flag from './../common/Flag';
import {MAPS} from './../common/Maps';
import WordBlock from '../common/WordBlock';
import Megaphone from '../common/Megaphone';

let game = null;
let client = null;
let clientPlayer = null;

export default class WesttownRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;
        client = clientEngine;
    }

    init() {
        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive')
            this.onDOMLoaded();
        else
            document.addEventListener('DOMContentLoaded', this.onDOMLoaded.bind(this));

        return new Promise((resolve, reject) => {
            game.emit('renderer.ready');
            resolve();
            console.log("promise resolved");
        });
    }

    onDOMLoaded() {
        console.log("DOM loaded");
        let mapImg = document.createElement("img");
        mapImg.id = "map";
        mapImg.src = "./lobby.png";
        mapImg.style.width = MAPS['/lobby'].width + "px";
        mapImg.style.height = MAPS['/lobby'].height + "px";
        mapImg.style.position = "absolute";

        document.getElementById("game").appendChild(mapImg);

        document.getElementById("button-1").addEventListener("click", () => {
            client.sendInput("heart");
        });
        document.getElementById("button-2").addEventListener("click", () => {
            client.sendInput("smile");
        });
        document.getElementById("button-3").addEventListener("click", () => {
            client.sendInput("frown");
        });

        document.addEventListener("keydown", (e) => {
            var allowedChars = "abcdefghijklmnopqrstuvwxyz1234567890";
            if (allowedChars.includes(e.key)) client.sendInput(e.key);
        });

        this.isReady = true;

    }

    addPlayer(obj) {
        let newPlayer = document.createElement("div");
        newPlayer.id = obj.id + "_" + obj.playerId;
        newPlayer.className = "player";
        newPlayer.style.height = game.playerRadius + "px";
        newPlayer.style.width = game.playerRadius + "px";
        newPlayer.style.position = "absolute";
        newPlayer.style.top = game.screenHeight/2 + "px";
        newPlayer.style.left = game.screenWidth/2 + "px";
        newPlayer.style.marginLeft = -game.playerRadius/2 + "px";
        newPlayer.style.marginTop = -game.playerRadius/2 + "px";
       // newPlayer.style.zIndex = 5;
        newPlayer.style.background = obj.color;
        newPlayer.style.backgroundImage = "url('costumes/costume" + obj.costume + ".png')";

        let playerEmote = document.createElement("h4");
        playerEmote.className = "emote";
        playerEmote.style.color = "white";
        playerEmote.style.marginLeft = -game.playerRadius/2 + "px";
        playerEmote.style.marginTop = -2.5*game.playerRadius + "px";

        newPlayer.appendChild(playerEmote);

        document.getElementById("game").appendChild(newPlayer);
        
    }

    removePlayer(obj) {
        let el = document.getElementById(obj.id + "_" + obj.playerId);
        if (el) el.remove();
    }

    addFlag(obj) {
        let newFlag = document.createElement("div");
        newFlag.id = obj.id;
        newFlag.className = "flag";
        newFlag.style.height = game.flagRadius + "px";
        newFlag.style.width = game.flagRadius + "px";
        newFlag.style.borderRadius = "50%";
        newFlag.style.background = obj.color;
        newFlag.style.position = "absolute";
        newFlag.style.marginLeft = -game.flagRadius/2 + "px";
        newFlag.style.marginTop = -game.flagRadius/2 + "px";

        newFlag.innerText = "🚩";

        document.getElementById("game").appendChild(newFlag);

    }

    removeObject(obj) {
        let el = document.getElementById(obj.id);
        if (el) el.remove();
    }

    addWordBlock(obj) {
        let newWordBlock = document.createElement("div");
        newWordBlock.id = obj.id;
        newWordBlock.className = "wordBlock";
        newWordBlock.style.height = game.wordBlockRadius + "px";
        newWordBlock.style.width = game.wordBlockRadius + "px";
        // newWordBlock.style.border = "grey 1px solid";
        // newWordBlock.style.background = "white";
        newWordBlock.style.position = "absolute";
        newWordBlock.style.marginLeft = -game.wordBlockRadius/2 + "px";
        newWordBlock.style.marginTop = -game.wordBlockRadius/2 + "px";

        newWordBlock.innerText = obj.character;
        // newWordBlock.style.color = "black";

        document.getElementById("game").appendChild(newWordBlock);
    }

    addMegaphone(obj) {
        let newMegaphone = document.createElement("div");
        newMegaphone.id = obj.id;
        newMegaphone.className = "megaphone";
        newMegaphone.style.height = game.megaphoneRadius + "px";
        newMegaphone.style.width = game.megaphoneRadius + "px";
        newMegaphone.style.position = "absolute";
        newMegaphone.style.marginLeft = -game.megaphoneRadius/2 + "px";
        newMegaphone.style.marginTop = -game.megaphoneRadius/2 + "px";

        newMegaphone.innerText = "📢";

        let megaphoneScreen = document.createElement("div");
        megaphoneScreen.className = "megaphone-screen";

        let megaphoneInput = document.createElement("input");
        megaphoneInput.className = "megaphone-message";
        megaphoneInput.type = "text";
        megaphoneInput.placeholder = "Your message";
        megaphoneInput.maxLength = 50;

        let megaphoneButton = document.createElement("button");
        megaphoneButton.className = "magephone-button";
        megaphoneButton.innerText = "Broadcast";

        megaphoneButton.addEventListener("click", () => {
            client.sendInput("broadcast:"+obj.id+":"+megaphoneInput.value);
        });

        megaphoneScreen.appendChild(megaphoneInput);
        megaphoneScreen.appendChild(megaphoneButton);

        newMegaphone.appendChild(megaphoneScreen);

        document.getElementById("game").appendChild(newMegaphone);
    }


    draw(t, dt) {
        super.draw(t, dt);

        if (!this.isReady) return;

        if (!clientPlayer) {
            clientPlayer = game.world.queryObject({playerId: game.playerId, instanceType: Player});
            return;
        }

        game.world.forEachObject((id, obj) => {            

            if (obj instanceof Player) {
                if (obj.playerId == clientPlayer.playerId) {
                    this.updateClientPlayer(document.getElementById(id + "_" + clientPlayer.playerId), obj);
                } else {

                    if (obj.emote) {
                        document.getElementById(id + "_" + obj.playerId).getElementsByClassName("emote")[0].innerText = obj.emote;
                    }

                    this.updateOtherObject(document.getElementById(id + "_" + obj.playerId), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
                }
                
            } else if (obj instanceof Flag) {
                document.getElementById(id).style.background = obj.color;

                this.updateOtherObject(document.getElementById(id), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
            
            } else if (obj instanceof WordBlock) {
                document.getElementById(id).innerText = obj.character;

                this.updateOtherObject(document.getElementById(id), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
            
            } else if (obj instanceof Megaphone) {
                if (game.distance(clientPlayer, obj) <= game.megaphoneRadius) document.getElementById(id).getElementsByClassName("megaphone-screen")[0].style.display = "block";
                else document.getElementById(id).getElementsByClassName("megaphone-screen")[0].style.display = "none";

                if (obj.isBroadcasting != 0) {
                    document.getElementById("broadcast").innerText = obj.message;
                    document.getElementById("broadcast").style.display = "block";
                }
                else document.getElementById("broadcast").style.display = "none";

                this.updateOtherObject(document.getElementById(id), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
            }
            
        });

    }

    // draw current view by moving the map unless at the edges (scrolling effect)
    updateClientPlayer(el, obj) {

        if (obj.emote) {
            el.getElementsByClassName("emote")[0].innerText = obj.emote;
        }

        var map = document.getElementById("map");

        if (!obj.room && (!obj.position.x || !obj.position.y)) {
            console.log("Room" + obj.room + " x " + obj.position.x + " y " + obj.position.y); 
            map.style.top = "0px";
            map.style.left = "0px";
            el.style.top = game.screenHeight/2 + "px";
            el.style.left = game.screenWidth/2 + "px";
            obj.position.x = game.screenWidth/2;
            obj.position.y = game.screenHeight/2;
            return;
        }

        map.src = "." + obj.room + ".png";
        map.style.width = MAPS[obj.room].width + "px";
        map.style.height = MAPS[obj.room].height + "px";


        if (obj.position.x >= MAPS[obj.room].width-game.screenWidth/2) {
            el.style.left = game.screenWidth - (MAPS[obj.room].width - obj.position.x) + "px";
        } else if (obj.position.x <= game.screenWidth/2) {
            el.style.left = obj.position.x + "px";
        } else {
            map.style.left = "-" + (obj.position.x - game.screenWidth/2) + "px";
        }

        if (obj.position.y >= MAPS[obj.room].height-game.screenHeight/2) {
            el.style.top = game.screenHeight - (MAPS[obj.room].height - obj.position.y) + "px";
        } else if (obj.position.y <= game.screenHeight/2) {
            el.style.top = obj.position.y + "px";
        } else {
            map.style.top = "-" + (obj.position.y - game.screenHeight/2) + "px";
        }
    }

    // draw other objects relative to the client's character
    updateOtherObject(el, obj, clientEl, clientObj) {

        var y = obj.position.y - clientObj.position.y + parseInt(clientEl.style.top.slice(0,-2));
        var x = obj.position.x - clientObj.position.x + parseInt(clientEl.style.left.slice(0,-2));

        el.style.top = y  + 'px';
        el.style.left = x + 'px';
    }
}