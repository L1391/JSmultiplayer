"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Player =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Player, _DynamicObject);

  _createClass(Player, [{
    key: "onAddToWorld",
    value: function onAddToWorld(gameEngine) {
      if (_lanceGg.Renderer) {
        _lanceGg.Renderer.getInstance().addPlayer(this);
      }
    }
  }, {
    key: "onRemoveFromWorld",
    value: function onRemoveFromWorld(gameEngine) {
      if (_lanceGg.Renderer) {
        _lanceGg.Renderer.getInstance().removePlayer(this);
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Player::".concat(_get(_getPrototypeOf(Player.prototype), "toString", this).call(this), " color=").concat(this.color, " costume=").concat(this.costume, " emote=").concat(this.emote, " keydown=").concat(this.keydown, " room=").concat(this.room);
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        color: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        },
        costume: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        emote: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        },
        keydown: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        },
        room: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        }
      }, _get(_getPrototypeOf(Player), "netScheme", this));
    }
  }]);

  function Player(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Player);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this, gameEngine, options, props));
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    _this.color = randomColor;
    _this.costume = Math.floor(Math.random() * 6) + 1;
    _this.emote = " ";
    _this.keydown = " ";
    _this.room = "/lobby";
    return _this;
  } // avoid gradual synchronization of velocity


  _createClass(Player, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Player.prototype), "syncTo", this).call(this, other);

      this.color = other.color;
      this.emote = other.emote;
      this.keydown = other.keydown;
      this.room = other.room;
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
  }]);

  return Player;
}(_lanceGg.DynamicObject);

exports.default = Player;
//# sourceMappingURL=Player.js.map