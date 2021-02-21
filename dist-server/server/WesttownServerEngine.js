"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Player = _interopRequireDefault(require("../common/Player"));

var _Door = _interopRequireDefault(require("../common/Door"));

var _Maps = require("../common/Maps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var game = null;

var WesttownServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(WesttownServerEngine, _ServerEngine);

  function WesttownServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, WesttownServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WesttownServerEngine).call(this, io, gameEngine, inputOptions));
    game = gameEngine;
    game.on('postStep', _this.gameLogic.bind(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(WesttownServerEngine, [{
    key: "randomPosition",
    value: function randomPosition() {
      return new _lanceGg.TwoVector(_Maps.MAPS['/lobby'].width * Math.random(), _Maps.MAPS['/lobby'].height * Math.random());
    }
  }, {
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(WesttownServerEngine.prototype), "start", this).call(this);

      console.log(_Maps.MAPS);

      for (var MAP in _Maps.MAPS) {
        if (MAP != '/lobby') this.createRoom(MAP);
      }

      for (var i = 0; i < 1; i++) {
        var flag = game.addFlag(this.randomPosition());
        this.assignObjectToRoom(flag, "/lobby");
      }

      console.log('added flags');
      var doors = [game.addDoor({
        x: 715,
        y: 140,
        fromRoom: '/lobby',
        toRoom: '/house',
        radius: 20
      }), game.addDoor({
        x: 200,
        y: 400,
        fromRoom: '/house',
        toRoom: '/lobby',
        radius: 30
      })];

      for (var _i = 0; _i < doors.length; _i++) {
        var door = doors[_i];
        this.assignObjectToRoom(door, door.fromRoom);
      }

      console.log('added doors');

      for (var _i2 = 0; _i2 < 1; _i2++) {
        var wordBlock = game.addWordBlock({
          character: "",
          position: this.randomPosition()
        });
        this.assignObjectToRoom(wordBlock, "/lobby");
        console.log(wordBlock);
      }

      console.log('added word blocks');

      for (var _i3 = 0; _i3 < 1; _i3++) {
        var megaphone = game.addMegaphone(this.randomPosition());
        this.assignObjectToRoom(megaphone, "/lobby");
        console.log(megaphone);
      }

      console.log('added megaphones');
    }
  }, {
    key: "gameLogic",
    value: function gameLogic() {
      var players = game.world.queryObjects({
        instanceType: _Player.default
      });
      var doors = game.world.queryObjects({
        instanceType: _Door.default
      });
      if (!players || !doors) return;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var player = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = doors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var door = _step2.value;

              if (Math.sqrt((player.position.x - door.position.x) * (player.position.x - door.position.x) + (player.position.y - door.position.y) * (player.position.y - door.position.y)) <= door.radius) {
                this.assignObjectToRoom(player, door.toRoom);
                this.assignPlayerToRoom(player.playerId, door.toRoom);
                player.room = door.toRoom;
                player.position.x = game.screenWidth / 2;
                player.position.y = game.screenHeight / 2;
                console.log(player);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(WesttownServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      game.addPlayer(socket.playerId);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(WesttownServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = game.world.queryObjects({
          playerId: playerId
        })[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var o = _step3.value;
          game.removeObjectFromWorld(o.id);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);

  return WesttownServerEngine;
}(_lanceGg.ServerEngine);

exports.default = WesttownServerEngine;
//# sourceMappingURL=WesttownServerEngine.js.map