import {GameEngine, SimplePhysicsEngine, TwoVector} from 'lance-gg';
import Player from './Player';
import Flag from './Flag';
import Door from './Door';
import WordBlock from './WordBlock';
import Megaphone from './Megaphone';
import {MAPS} from './Maps';

export default class WesttownGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        Object.assign(this, {
            screenWidth: 400, screenHeight: 400, 
            playerRadius:16, flagRadius: 20, wordBlockRadius: 32, megaphoneRadius: 16,
            padding: 10
        });

        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

        // common code
        this.on('postStep', this.gameLogic.bind(this));

    }

    registerClasses(serializer) {
        serializer.registerClass(Player);
        serializer.registerClass(Flag);
        serializer.registerClass(Door);
        serializer.registerClass(WordBlock);
        serializer.registerClass(Megaphone);
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);

        let player = this.world.queryObject({ playerId: playerId, instanceType: Player });

        // bind arrows to movement
        if (player) {
            if (inputData.input === 'up') {
                player.position.y -= 5;
            } else if (inputData.input === 'down') {
                player.position.y += 5;
            }

            if (inputData.input === 'left') {
                player.position.x -= 5;
            } else if (inputData.input === 'right') {
                player.position.x += 5;
            }

            // bind space to boolean character status
            if (inputData.input === 'heart') {
                console.log("emote input received");
                player.emote = "<3";
                setTimeout(() => {player.emote = " "}, 3000);
            } else if (inputData.input === 'smile') {
                player.emote = ":)";
                setTimeout(() => {player.emote = " "}, 3000);
            } else if (inputData.input === 'frown') {
                player.emote = ":(";
                setTimeout(() => {player.emote = " "}, 3000);
            } 

            if (inputData.input.toString().length == 1) {
                player.keydown = inputData.input;
            } else {
                player.keydown = " ";
            }
        }

        if (inputData.input.includes("broadcast")) {
            console.log("broadcast input received");
            console.log(inputData.input);

            let message = inputData.input.split(":");
            let megaphone = this.world.queryObject({id: parseInt(message[1]), instanceType: Megaphone});

            console.log(megaphone);

            if (megaphone) {
                console.log("broadcasting");
                megaphone.message = message[2];
                megaphone.isBroadcasting = 1;

                setTimeout(() => megaphone.isBroadcasting = 0, 10000);
            }
        }

    }

    gameLogic(stepInfo) {
        if (stepInfo.isReenact) return;

        let players = this.world.queryObjects({ instanceType: Player });
        let flags = this.world.queryObjects({ instanceType: Flag });
        let wordblocks = this.world.queryObjects({ instanceType: WordBlock });

        if (!players) return;

        
        //Test boundaries for each character
        for (const player of players) {
            if(!player.room) {
                continue
            };

            if (player.position.y < this.padding) {
                player.position.y = this.padding;
            } else if (player.position.y > MAPS[player.room].height - this.padding) {
                player.position.y = MAPS[player.room].height - this.padding;
            }

            if (player.position.x < this.padding) {
                player.position.x = this.padding;
            } else if (player.position.x > MAPS[player.room].width - this.padding) {
                player.position.x = MAPS[player.room].width - this.padding;
            }
            
            if (flags) {
                for (const flag of flags) {
                    if (this.distance(player, flag) <= this.flagRadius) {
                        flag.color = player.color;
                    }
                }
            }


            if (wordblocks) {
                for (const wordblock of wordblocks) {
                    if (this.distance(player, wordblock) <= this.wordBlockRadius && player.keydown != " ") {
                        wordblock.character = player.keydown;
                    }
                }
            }


        }
    }

    distance(obj1, obj2) {
        return Math.sqrt((obj1.position.x - obj2.position.x)*(obj1.position.x - obj2.position.x) + (obj1.position.y - obj2.position.y)*(obj1.position.y - obj2.position.y));
    }


    addPlayer(playerId) {
        let player = new Player(this,null, { playerId, position: new TwoVector(this.screenWidth/2, this.screenHeight/2)});

        this.addObjectToWorld(player);
        return player;
    }

    addFlag(info) {
        let flag = new Flag(this,null,{playerId: 0, position: info});
        
        this.addObjectToWorld(flag);
        return flag;
    }

    addDoor(info) {
        let door = new Door(this,null,{playerId: 0, position: new TwoVector(info.x, info.y)});
        door.toRoom = info.toRoom;
        door.fromRoom = info.fromRoom;
        door.radius = info.radius;

        this.addObjectToWorld(door);
        return door;
    }

    addWordBlock(info) {
        let wordBlock = new WordBlock(this, null, {playerId: 0, position: info.position });
        wordBlock.character = info.character;
        
        this.addObjectToWorld(wordBlock);
        return wordBlock;
    }

    addMegaphone(info) {
        let megaphone = new Megaphone(this, null, {playerId: 0, position: info});

        this.addObjectToWorld(megaphone);
        return megaphone;
    }

}
