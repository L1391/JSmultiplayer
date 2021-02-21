"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Player = _interopRequireDefault(require("./../common/Player"));

var _Flag = _interopRequireDefault(require("./../common/Flag"));

var _Maps = require("./../common/Maps");

var _WordBlock = _interopRequireDefault(require("../common/WordBlock"));

var _Megaphone = _interopRequireDefault(require("../common/Megaphone"));

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
var client = null;
var clientPlayer = null;

var WesttownRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(WesttownRenderer, _Renderer);

  function WesttownRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, WesttownRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WesttownRenderer).call(this, gameEngine, clientEngine));
    game = gameEngine;
    client = clientEngine;
    return _this;
  }

  _createClass(WesttownRenderer, [{
    key: "init",
    value: function init() {
      if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') this.onDOMLoaded();else document.addEventListener('DOMContentLoaded', this.onDOMLoaded.bind(this));
      return new Promise(function (resolve, reject) {
        game.emit('renderer.ready');
        resolve();
        console.log("promise resolved");
      });
    }
  }, {
    key: "onDOMLoaded",
    value: function onDOMLoaded() {
      console.log("DOM loaded");
      var mapImg = document.createElement("img");
      mapImg.id = "map";
      mapImg.src = "./lobby.png";
      mapImg.style.width = _Maps.MAPS['/lobby'].width + "px";
      mapImg.style.height = _Maps.MAPS['/lobby'].height + "px";
      mapImg.style.position = "absolute";
      document.getElementById("game").appendChild(mapImg);
      document.getElementById("button-1").addEventListener("click", function () {
        client.sendInput("heart");
      });
      document.getElementById("button-2").addEventListener("click", function () {
        client.sendInput("smile");
      });
      document.getElementById("button-3").addEventListener("click", function () {
        client.sendInput("frown");
      });
      document.addEventListener("keydown", function (e) {
        var allowedChars = "abcdefghijklmnopqrstuvwxyz1234567890";
        if (allowedChars.includes(e.key)) client.sendInput(e.key);
      });
      this.isReady = true;
    }
  }, {
    key: "addPlayer",
    value: function addPlayer(obj) {
      var newPlayer = document.createElement("div");
      newPlayer.id = obj.id + "_" + obj.playerId;
      newPlayer.className = "player";
      newPlayer.style.height = game.playerRadius + "px";
      newPlayer.style.width = game.playerRadius + "px";
      newPlayer.style.position = "absolute";
      newPlayer.style.top = game.screenHeight / 2 + "px";
      newPlayer.style.left = game.screenWidth / 2 + "px";
      newPlayer.style.marginLeft = -game.playerRadius / 2 + "px";
      newPlayer.style.marginTop = -game.playerRadius / 2 + "px"; // newPlayer.style.zIndex = 5;

      newPlayer.style.background = obj.color;
      newPlayer.style.backgroundImage = "url('costumes/costume" + obj.costume + ".png')";
      var playerEmote = document.createElement("h4");
      playerEmote.className = "emote";
      playerEmote.style.color = "white";
      playerEmote.style.marginLeft = -game.playerRadius / 2 + "px";
      playerEmote.style.marginTop = -2.5 * game.playerRadius + "px";
      newPlayer.appendChild(playerEmote);
      document.getElementById("game").appendChild(newPlayer);
    }
  }, {
    key: "removePlayer",
    value: function removePlayer(obj) {
      var el = document.getElementById(obj.id + "_" + obj.playerId);
      if (el) el.remove();
    }
  }, {
    key: "addFlag",
    value: function addFlag(obj) {
      var newFlag = document.createElement("div");
      newFlag.id = obj.id;
      newFlag.className = "flag";
      newFlag.style.height = game.flagRadius + "px";
      newFlag.style.width = game.flagRadius + "px";
      newFlag.style.borderRadius = "50%";
      newFlag.style.background = obj.color;
      newFlag.style.position = "absolute";
      newFlag.style.marginLeft = -game.flagRadius / 2 + "px";
      newFlag.style.marginTop = -game.flagRadius / 2 + "px";
      newFlag.innerText = "🚩";
      document.getElementById("game").appendChild(newFlag);
    }
  }, {
    key: "removeObject",
    value: function removeObject(obj) {
      var el = document.getElementById(obj.id);
      if (el) el.remove();
    }
  }, {
    key: "addWordBlock",
    value: function addWordBlock(obj) {
      var newWordBlock = document.createElement("div");
      newWordBlock.id = obj.id;
      newWordBlock.className = "wordBlock";
      newWordBlock.style.height = game.wordBlockRadius + "px";
      newWordBlock.style.width = game.wordBlockRadius + "px"; // newWordBlock.style.border = "grey 1px solid";
      // newWordBlock.style.background = "white";

      newWordBlock.style.position = "absolute";
      newWordBlock.style.marginLeft = -game.wordBlockRadius / 2 + "px";
      newWordBlock.style.marginTop = -game.wordBlockRadius / 2 + "px";
      newWordBlock.innerText = obj.character; // newWordBlock.style.color = "black";

      document.getElementById("game").appendChild(newWordBlock);
    }
  }, {
    key: "addMegaphone",
    value: function addMegaphone(obj) {
      var newMegaphone = document.createElement("div");
      newMegaphone.id = obj.id;
      newMegaphone.className = "megaphone";
      newMegaphone.style.height = game.megaphoneRadius + "px";
      newMegaphone.style.width = game.megaphoneRadius + "px";
      newMegaphone.style.position = "absolute";
      newMegaphone.style.marginLeft = -game.megaphoneRadius / 2 + "px";
      newMegaphone.style.marginTop = -game.megaphoneRadius / 2 + "px";
      newMegaphone.innerText = "📢";
      var megaphoneScreen = document.createElement("div");
      megaphoneScreen.className = "megaphone-screen";
      var megaphoneInput = document.createElement("input");
      megaphoneInput.className = "megaphone-message";
      megaphoneInput.type = "text";
      megaphoneInput.placeholder = "Your message";
      megaphoneInput.maxLength = 50;
      var megaphoneButton = document.createElement("button");
      megaphoneButton.className = "magephone-button";
      megaphoneButton.innerText = "Broadcast";
      megaphoneButton.addEventListener("click", function () {
        client.sendInput("broadcast:" + obj.id + ":" + megaphoneInput.value);
      });
      megaphoneScreen.appendChild(megaphoneInput);
      megaphoneScreen.appendChild(megaphoneButton);
      newMegaphone.appendChild(megaphoneScreen);
      document.getElementById("game").appendChild(newMegaphone);
    }
  }, {
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(WesttownRenderer.prototype), "draw", this).call(this, t, dt);

      if (!this.isReady) return;

      if (!clientPlayer) {
        clientPlayer = game.world.queryObject({
          playerId: game.playerId,
          instanceType: _Player.default
        });
        return;
      }

      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Player.default) {
          if (obj.playerId == clientPlayer.playerId) {
            _this2.updateClientPlayer(document.getElementById(id + "_" + clientPlayer.playerId), obj);
          } else {
            if (obj.emote) {
              document.getElementById(id + "_" + obj.playerId).getElementsByClassName("emote")[0].innerText = obj.emote;
            }

            _this2.updateOtherObject(document.getElementById(id + "_" + obj.playerId), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
          }
        } else if (obj instanceof _Flag.default) {
          document.getElementById(id).style.background = obj.color;

          _this2.updateOtherObject(document.getElementById(id), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
        } else if (obj instanceof _WordBlock.default) {
          document.getElementById(id).innerText = obj.character;

          _this2.updateOtherObject(document.getElementById(id), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
        } else if (obj instanceof _Megaphone.default) {
          if (game.distance(clientPlayer, obj) <= game.megaphoneRadius) document.getElementById(id).getElementsByClassName("megaphone-screen")[0].style.display = "block";else document.getElementById(id).getElementsByClassName("megaphone-screen")[0].style.display = "none";

          if (obj.isBroadcasting != 0) {
            document.getElementById("broadcast").innerText = obj.message;
            document.getElementById("broadcast").style.display = "block";
          } else document.getElementById("broadcast").style.display = "none";

          _this2.updateOtherObject(document.getElementById(id), obj, document.getElementById(clientPlayer.id + "_" + clientPlayer.playerId), clientPlayer);
        }
      });
    } // draw current view by moving the map unless at the edges (scrolling effect)

  }, {
    key: "updateClientPlayer",
    value: function updateClientPlayer(el, obj) {
      if (obj.emote) {
        el.getElementsByClassName("emote")[0].innerText = obj.emote;
      }

      var map = document.getElementById("map");

      if (!obj.room && (!obj.position.x || !obj.position.y)) {
        console.log("Room" + obj.room + " x " + obj.position.x + " y " + obj.position.y);
        map.style.top = "0px";
        map.style.left = "0px";
        el.style.top = game.screenHeight / 2 + "px";
        el.style.left = game.screenWidth / 2 + "px";
        obj.position.x = game.screenWidth / 2;
        obj.position.y = game.screenHeight / 2;
        return;
      }

      map.src = "." + obj.room + ".png";
      map.style.width = _Maps.MAPS[obj.room].width + "px";
      map.style.height = _Maps.MAPS[obj.room].height + "px";

      if (obj.position.x >= _Maps.MAPS[obj.room].width - game.screenWidth / 2) {
        el.style.left = game.screenWidth - (_Maps.MAPS[obj.room].width - obj.position.x) + "px";
      } else if (obj.position.x <= game.screenWidth / 2) {
        el.style.left = obj.position.x + "px";
      } else {
        map.style.left = "-" + (obj.position.x - game.screenWidth / 2) + "px";
      }

      if (obj.position.y >= _Maps.MAPS[obj.room].height - game.screenHeight / 2) {
        el.style.top = game.screenHeight - (_Maps.MAPS[obj.room].height - obj.position.y) + "px";
      } else if (obj.position.y <= game.screenHeight / 2) {
        el.style.top = obj.position.y + "px";
      } else {
        map.style.top = "-" + (obj.position.y - game.screenHeight / 2) + "px";
      }
    } // draw other objects relative to the client's character

  }, {
    key: "updateOtherObject",
    value: function updateOtherObject(el, obj, clientEl, clientObj) {
      var y = obj.position.y - clientObj.position.y + parseInt(clientEl.style.top.slice(0, -2));
      var x = obj.position.x - clientObj.position.x + parseInt(clientEl.style.left.slice(0, -2));
      el.style.top = y + 'px';
      el.style.left = x + 'px';
    }
  }]);

  return WesttownRenderer;
}(_lanceGg.Renderer);

exports.default = WesttownRenderer;
//# sourceMappingURL=WesttownRenderer.js.map