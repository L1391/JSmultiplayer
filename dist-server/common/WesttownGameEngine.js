"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Player = _interopRequireDefault(require("./Player"));

var _Flag = _interopRequireDefault(require("./Flag"));

var _Door = _interopRequireDefault(require("./Door"));

var _WordBlock = _interopRequireDefault(require("./WordBlock"));

var _Megaphone = _interopRequireDefault(require("./Megaphone"));

var _Maps = require("./Maps");

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

var WesttownGameEngine =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(WesttownGameEngine, _GameEngine);

  function WesttownGameEngine(options) {
    var _this;

    _classCallCheck(this, WesttownGameEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WesttownGameEngine).call(this, options));
    Object.assign(_assertThisInitialized(_this), {
      screenWidth: 400,
      screenHeight: 400,
      playerRadius: 16,
      flagRadius: 20,
      wordBlockRadius: 32,
      megaphoneRadius: 16,
      padding: 10
    });
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this)
    }); // common code

    _this.on('postStep', _this.gameLogic.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(WesttownGameEngine, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Player.default);
      serializer.registerClass(_Flag.default);
      serializer.registerClass(_Door.default);
      serializer.registerClass(_WordBlock.default);
      serializer.registerClass(_Megaphone.default);
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(WesttownGameEngine.prototype), "processInput", this).call(this, inputData, playerId);

      var player = this.world.queryObject({
        playerId: playerId,
        instanceType: _Player.default
      }); // bind arrows to movement

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
        } // bind space to boolean character status


        if (inputData.input === 'heart') {
          console.log("emote input received");
          player.emote = "<3";
          setTimeout(function () {
            player.emote = " ";
          }, 3000);
        } else if (inputData.input === 'smile') {
          player.emote = ":)";
          setTimeout(function () {
            player.emote = " ";
          }, 3000);
        } else if (inputData.input === 'frown') {
          player.emote = ":(";
          setTimeout(function () {
            player.emote = " ";
          }, 3000);
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
        var message = inputData.input.split(":");
        var megaphone = this.world.queryObject({
          id: parseInt(message[1]),
          instanceType: _Megaphone.default
        });
        console.log(megaphone);

        if (megaphone) {
          console.log("broadcasting");
          megaphone.message = message[2];
          megaphone.isBroadcasting = 1;
          setTimeout(function () {
            return megaphone.isBroadcasting = 0;
          }, 10000);
        }
      }
    }
  }, {
    key: "gameLogic",
    value: function gameLogic(stepInfo) {
      if (stepInfo.isReenact) return;
      var players = this.world.queryObjects({
        instanceType: _Player.default
      });
      var flags = this.world.queryObjects({
        instanceType: _Flag.default
      });
      var wordblocks = this.world.queryObjects({
        instanceType: _WordBlock.default
      });
      if (!players) return; //Test boundaries for each character

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var player = _step.value;

          if (!player.room) {
            continue;
          }

          ;

          if (player.position.y < this.padding) {
            player.position.y = this.padding;
          } else if (player.position.y > _Maps.MAPS[player.room].height - this.padding) {
            player.position.y = _Maps.MAPS[player.room].height - this.padding;
          }

          if (player.position.x < this.padding) {
            player.position.x = this.padding;
          } else if (player.position.x > _Maps.MAPS[player.room].width - this.padding) {
            player.position.x = _Maps.MAPS[player.room].width - this.padding;
          }

          if (flags) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = flags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var flag = _step2.value;

                if (this.distance(player, flag) <= this.flagRadius) {
                  flag.color = player.color;
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

          if (wordblocks) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = wordblocks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var wordblock = _step3.value;

                if (this.distance(player, wordblock) <= this.wordBlockRadius && player.keydown != " ") {
                  wordblock.character = player.keydown;
                }
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
    key: "distance",
    value: function distance(obj1, obj2) {
      return Math.sqrt((obj1.position.x - obj2.position.x) * (obj1.position.x - obj2.position.x) + (obj1.position.y - obj2.position.y) * (obj1.position.y - obj2.position.y));
    }
  }, {
    key: "addPlayer",
    value: function addPlayer(playerId) {
      var player = new _Player.default(this, null, {
        playerId: playerId,
        position: new _lanceGg.TwoVector(this.screenWidth / 2, this.screenHeight / 2)
      });
      this.addObjectToWorld(player);
      return player;
    }
  }, {
    key: "addFlag",
    value: function addFlag(info) {
      var flag = new _Flag.default(this, null, {
        playerId: 0,
        position: info
      });
      this.addObjectToWorld(flag);
      return flag;
    }
  }, {
    key: "addDoor",
    value: function addDoor(info) {
      var door = new _Door.default(this, null, {
        playerId: 0,
        position: new _lanceGg.TwoVector(info.x, info.y)
      });
      door.toRoom = info.toRoom;
      door.fromRoom = info.fromRoom;
      door.radius = info.radius;
      this.addObjectToWorld(door);
      return door;
    }
  }, {
    key: "addWordBlock",
    value: function addWordBlock(info) {
      var wordBlock = new _WordBlock.default(this, null, {
        playerId: 0,
        position: info.position
      });
      wordBlock.character = info.character;
      this.addObjectToWorld(wordBlock);
      return wordBlock;
    }
  }, {
    key: "addMegaphone",
    value: function addMegaphone(info) {
      var megaphone = new _Megaphone.default(this, null, {
        playerId: 0,
        position: info
      });
      this.addObjectToWorld(megaphone);
      return megaphone;
    }
  }]);

  return WesttownGameEngine;
}(_lanceGg.GameEngine);

exports.default = WesttownGameEngine;
//# sourceMappingURL=WesttownGameEngine.js.map