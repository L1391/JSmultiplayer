import {ServerEngine, TwoVector} from 'lance-gg';
import Player from '../common/Player';
import Door from '../common/Door';

import {MAPS} from '../common/Maps';

let game = null;

export default class WesttownServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        game = gameEngine;

        game.on('postStep', this.gameLogic.bind(this));
    }

    randomPosition() {
        return new TwoVector(MAPS['/lobby'].width * Math.random(), MAPS['/lobby'].height*Math.random());
    }

    start() {
        super.start();

        console.log(MAPS);

        for (let MAP in MAPS) {
            if (MAP != '/lobby') this.createRoom(MAP);
        }

        for (let i = 0; i < 1; i++ ) {
            let flag = game.addFlag(this.randomPosition());
            this.assignObjectToRoom(flag, "/lobby");
        }


        console.log('added flags');

        let doors = [game.addDoor({x: 715, y: 140, fromRoom: '/lobby', toRoom:'/house', radius: 20}),
                    game.addDoor({x: 200, y: 400, fromRoom: '/house', toRoom:'/lobby', radius: 30})
                ];


        for (let door of doors) {
            this.assignObjectToRoom(door, door.fromRoom);
        }

        console.log('added doors');

        for (let i = 0; i < 1; i++ ) {
            let wordBlock = game.addWordBlock({character: "", position: this.randomPosition()});
            this.assignObjectToRoom(wordBlock, "/lobby");

            console.log(wordBlock);
        }

        console.log('added word blocks');

        for (let i = 0; i < 1; i++ ) {
            let megaphone = game.addMegaphone(this.randomPosition());
            this.assignObjectToRoom(megaphone, "/lobby");

            console.log(megaphone);
        }

        console.log('added megaphones');


    }

    gameLogic() {

        let players = game.world.queryObjects({instanceType: Player});
        let doors = game.world.queryObjects({instanceType: Door});

        if (!players || !doors) return;

        for (let player of players) {

            for( let door of doors) {
                if (Math.sqrt((player.position.x - door.position.x)*(player.position.x - door.position.x) + (player.position.y - door.position.y)*(player.position.y - door.position.y)) <= door.radius) {
                    this.assignObjectToRoom(player, door.toRoom);
                    this.assignPlayerToRoom(player.playerId, door.toRoom);
                    player.room = door.toRoom;
                    player.position.x = game.screenWidth/2;
                    player.position.y = game.screenHeight/2;

                    console.log(player);
                }
            }
        }

    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        game.addPlayer(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        for (let o of game.world.queryObjects({ playerId }))
            game.removeObjectFromWorld(o.id);
    }

}