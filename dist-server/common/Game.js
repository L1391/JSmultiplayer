"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Room = function Room(name, width, height, paths) {
  _classCallCheck(this, Room);

  this.name = name;
  this.width = width;
  this.height = height;
  this.paths = paths;
};

var lobby = new Room("/lobby", 1200, 1200, {
  '/house': {
    'x': 715,
    'y': 140
  }
});
var house = new Room("/house", 400, 400, {
  '/lobby': {
    'x': 200,
    'y': 390
  }
}); // /////////////////////////////////////////////////////////
//
// GAME OBJECTS
//
// /////////////////////////////////////////////////////////
//SIZE CONSTANTS

var SCREEN_WIDTH = 400;
var SCREEN_HEIGHT = 400;
var MAP_WIDTH = 1200;
var MAP_HEIGHT = 1200;
var CHAR_RADIUS = 10;
var PADDING = CHAR_RADIUS * 0.75;
var FLAG_RADIUS = 20;

var Character =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Character, _DynamicObject);

  function Character(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Character);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Character).call(this, gameEngine, options, props));
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    _this.color = randomColor;
    _this.emote = "";
    return _this;
  } // avoid gradual synchronization of velocity


  _createClass(Character, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Character.prototype), "syncTo", this).call(this, other);

      this.color = other.color;
      this.emote = other.emote;
    }
  }, {
    key: "bending",
    get: function get() {
      return {
        velocity: {
          percent: 0.0
        }
      };
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        color: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        },
        emote: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        }
      }, _get(_getPrototypeOf(Character), "netScheme", this));
    }
  }]);

  return Character;
}(_lanceGg.DynamicObject);

var Flag =
/*#__PURE__*/
function (_DynamicObject2) {
  _inherits(Flag, _DynamicObject2);

  function Flag(gameEngine, options, props) {
    var _this2;

    _classCallCheck(this, Flag);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Flag).call(this, gameEngine, options, props));
    _this2.color = "#ffffff";
    return _this2;
  }

  _createClass(Flag, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Flag.prototype), "syncTo", this).call(this, other);

      this.color = other.color;
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        color: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        }
      }, _get(_getPrototypeOf(Flag), "netScheme", this));
    }
  }]);

  return Flag;
}(_lanceGg.DynamicObject); // /////////////////////////////////////////////////////////
//
// GAME ENGINE
//
// /////////////////////////////////////////////////////////


var pastCharacters;

var Game =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(Game, _GameEngine);

  function Game(options) {
    var _this3;

    _classCallCheck(this, Game);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Game).call(this, options));
    _this3.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this3)
    }); // common code

    _this3.on('postStep', _this3.gameLogic.bind(_assertThisInitialized(_this3))); // server-only code


    _this3.on('server__init', _this3.serverSideInit.bind(_assertThisInitialized(_this3)));

    _this3.on('server__playerJoined', _this3.serverSidePlayerJoined.bind(_assertThisInitialized(_this3)));

    _this3.on('server__playerDisconnected', _this3.serverSidePlayerDisconnected.bind(_assertThisInitialized(_this3))); // client-only code


    _this3.on('client__rendererReady', _this3.clientSideInit.bind(_assertThisInitialized(_this3)));

    _this3.on('client__draw', _this3.clientSideDraw.bind(_assertThisInitialized(_this3)));

    return _this3;
  }

  _createClass(Game, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(Character);
      serializer.registerClass(Flag);
    }
  }, {
    key: "gameLogic",
    value: function gameLogic() {
      var characters = this.world.queryObjects({
        instanceType: Character
      });
      var flags = this.world.queryObjects({
        instanceType: Flag
      });
      if (!characters) return; //Test boundaries for each character

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = characters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var character = _step.value;

          if (character.position.y < PADDING) {
            character.position.y = PADDING;
          } else if (character.position.y > MAP_HEIGHT - PADDING) {
            character.position.y = MAP_HEIGHT - PADDING;
          }

          if (character.position.x < PADDING) {
            character.position.x = PADDING;
          } else if (character.position.x > MAP_WIDTH - PADDING) {
            character.position.x = MAP_WIDTH - PADDING;
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = flags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var flag = _step2.value;

              if (Math.sqrt((character.position.x - flag.position.x) * (character.position.x - flag.position.x) + (character.position.y - flag.position.y) * (character.position.y - flag.position.y)) <= FLAG_RADIUS) {
                flag.color = character.color;
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
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(Game.prototype), "processInput", this).call(this, inputData, playerId);

      var character = this.world.queryObject({
        playerId: playerId
      }); // bind arrows to movement

      if (character) {
        if (inputData.input === 'up') {
          character.position.y -= 5;
        } else if (inputData.input === 'down') {
          character.position.y += 5;
        }

        if (inputData.input === 'left') {
          character.position.x -= 5;
        } else if (inputData.input === 'right') {
          character.position.x += 5;
        } // bind space to boolean character status


        if (inputData.input === 'heart') {
          character.emote = "<3";
        } else if (inputData.input === 'smile') {
          character.emote = ":)";
        } else if (inputData.input === 'frown') {
          character.emote = ":(";
        } else {
          character.emote = " ";
        }
      }
    } // /////////////////////////////////////////////////////////
    //
    // SERVER ONLY CODE
    //
    // /////////////////////////////////////////////////////////

  }, {
    key: "serverSideInit",
    value: function serverSideInit() {
      //this.renderer.serverEngine.createRoom(house.name);
      var flag = this.addObjectToWorld(new Flag(this, null, {
        position: new _lanceGg.TwoVector(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT)
      }));
      var flag2 = this.addObjectToWorld(new Flag(this, null, {
        position: new _lanceGg.TwoVector(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT)
      }));
    }
  }, {
    key: "serverSidePlayerJoined",
    value: function serverSidePlayerJoined(ev) {
      var character = this.addObjectToWorld(new Character(this, null, {
        position: new _lanceGg.TwoVector(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)
      }));
      character.playerId = ev.playerId;
    }
  }, {
    key: "serverSidePlayerDisconnected",
    value: function serverSidePlayerDisconnected(ev) {
      var character = this.world.queryObject({
        playerId: ev.playerId
      });
      this.removeObjectFromWorld(character);
    } // /////////////////////////////////////////////////////////
    //
    // CLIENT ONLY CODE
    //
    // /////////////////////////////////////////////////////////

  }, {
    key: "clientSideInit",
    value: function clientSideInit() {
      var _this4 = this;

      console.log(this);
      this.controls = new _lanceGg.KeyboardControls(this.renderer.clientEngine);
      this.controls.bindKey('up', 'up', {
        repeat: true
      });
      this.controls.bindKey('down', 'down', {
        repeat: true
      });
      this.controls.bindKey('left', 'left', {
        repeat: true
      });
      this.controls.bindKey('right', 'right', {
        repeat: true
      });
      document.getElementById("button-1").addEventListener("click", function () {
        _this4.renderer.clientEngine.sendInput("heart");
      });
      document.getElementById("button-2").addEventListener("click", function () {
        _this4.renderer.clientEngine.sendInput("smile");
      });
      document.getElementById("button-3").addEventListener("click", function () {
        _this4.renderer.clientEngine.sendInput("frown");
      });
    }
  }, {
    key: "clientSideDraw",
    value: function clientSideDraw() {
      // draw other characters relative to the client's character
      function updateOtherCharacters(el, obj, clientEl, clientObj) {
        if (obj.emote) {
          el.getElementsByClassName("emote")[0].innerText = obj.emote;
        }

        var y = obj.position.y - clientObj.position.y + parseInt(clientEl.style.top.slice(0, -2));
        var x = obj.position.x - clientObj.position.x + parseInt(clientEl.style.left.slice(0, -2));
        el.style.top = y + 'px';
        el.style.left = x + 'px';
      }

      function updateFlag(el, obj, clientEl, clientObj) {
        var y = obj.position.y - clientObj.position.y + parseInt(clientEl.style.top.slice(0, -2));
        var x = obj.position.x - clientObj.position.x + parseInt(clientEl.style.left.slice(0, -2));
        el.style.top = y + 'px';
        el.style.left = x + 'px';
        el.style.background = obj.color;
      } // draw current view by moving the map unless at the edges (scrolling effect)


      function updateClientCharacter(el, obj) {
        if (obj.emote) {
          el.getElementsByClassName("emote")[0].innerText = obj.emote;
        }

        var map = document.getElementById("map");

        if (!map) {}

        if (obj.position.x >= MAP_WIDTH - SCREEN_WIDTH / 2) {
          el.style.left = SCREEN_WIDTH - (MAP_WIDTH - obj.position.x) + "px";
        } else if (obj.position.x <= SCREEN_WIDTH / 2) {
          el.style.left = obj.position.x + "px";
        } else {
          map.style.left = "-" + (obj.position.x - SCREEN_WIDTH / 2) + "px";
        }

        if (obj.position.y >= MAP_HEIGHT - SCREEN_HEIGHT / 2) {
          el.style.top = SCREEN_HEIGHT - (MAP_HEIGHT - obj.position.y) + "px";
        } else if (obj.position.y <= SCREEN_HEIGHT / 2) {
          el.style.top = obj.position.y + "px";
        } else {
          map.style.top = "-" + (obj.position.y - SCREEN_HEIGHT / 2);
        }
      } // query character objects


      var characters = this.world.queryObjects({
        instanceType: Character
      });
      if (!characters) return;
      var clientPlayer = this.world.queryObject({
        playerId: this.playerId
      });
      if (!clientPlayer) return;
      console.log(clientPlayer);
      var flags = this.world.queryObjects({
        instanceType: Flag
      }); // remove disconnected characters from the DOM

      if (pastCharacters) {
        var difference = pastCharacters.filter(function (x) {
          return characters.indexOf(x) === -1;
        });
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = difference[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var dif = _step3.value;
            document.getElementById(dif.playerId).remove();
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

      pastCharacters = characters; // render each character

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = characters[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var character = _step4.value;

          // if not on DOM yet, create the chracter
          if (!document.getElementById(character.playerId)) {
            var newPlayer = document.createElement("div");
            newPlayer.id = character.playerId;
            newPlayer.className = "character";
            newPlayer.style.height = CHAR_RADIUS + "px";
            newPlayer.style.width = CHAR_RADIUS + "px";
            newPlayer.style.background = character.color;
            newPlayer.style.position = "absolute";
            newPlayer.style.top = SCREEN_HEIGHT / 2 + "px";
            newPlayer.style.left = SCREEN_WIDTH / 2 + "px";
            newPlayer.style.marginLeft = -CHAR_RADIUS / 2 + "px";
            newPlayer.style.marginTop = -CHAR_RADIUS / 2 + "px";
            newPlayer.style.zIndex = 5;
            var playerEmote = document.createElement("h4");
            playerEmote.className = "emote";
            playerEmote.style.color = "white";
            playerEmote.style.marginLeft = -CHAR_RADIUS / 2 + "px";
            playerEmote.style.marginTop = -2.5 * CHAR_RADIUS + "px";
            newPlayer.appendChild(playerEmote);
            document.getElementById("game").appendChild(newPlayer);
          } else {
            // render character depending on if it is the client's character
            if (character.playerId == this.playerId) {
              updateClientCharacter(document.getElementById(this.playerId), character);
            } else {
              updateOtherCharacters(document.getElementById(character.playerId), character, document.getElementById(this.playerId), clientPlayer);
            }
          }
        } //render each flag

      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = flags[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var flag = _step5.value;

          // if not on DOM yet, create the flag
          if (!document.getElementById(flag.id)) {
            var newFlag = document.createElement("div");
            newFlag.id = flag.id;
            newFlag.className = "flag";
            newFlag.style.height = FLAG_RADIUS + "px";
            newFlag.style.width = FLAG_RADIUS + "px";
            newFlag.style.borderRadius = "50%";
            newFlag.style.background = flag.color;
            newFlag.style.position = "absolute";
            newFlag.style.marginLeft = -FLAG_RADIUS / 2 + "px";
            newFlag.style.marginTop = -FLAG_RADIUS / 2 + "px";
            var flagText = document.createElement("h3");
            flagText.innerText = "P";
            flagText.color = "black";
            flagText.marginLeft = "5px";
            flagText.marginTop = "-5px";
            newFlag.appendChild(flagText);
            document.getElementById("game").appendChild(newFlag);
          } else {
            updateFlag(document.getElementById(flag.id), flag, document.getElementById(this.playerId), clientPlayer);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }]);

  return Game;
}(_lanceGg.GameEngine);

exports.default = Game;
//# sourceMappingURL=Game.js.map