import path from 'path';
import express from 'express';
import socketIO from 'socket.io';
import { Lib } from 'lance-gg';
import WesttownGameEngine from './common/WesttownGameEngine';
import WesttownServerEngine from './server/WesttownServerEngine';

//IPv4 192.168.1.161

const PORT = 80; //process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../dist/index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '../dist/')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Instances
const gameEngine = new WesttownGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
const serverEngine = new WesttownServerEngine(io, gameEngine, { debug: {}, updateRate: 6 });

// start the game
serverEngine.start();
