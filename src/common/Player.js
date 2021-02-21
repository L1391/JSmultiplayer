import {BaseTypes, DynamicObject, Renderer} from 'lance-gg';

export default class Player extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            color: { type: BaseTypes.TYPES.STRING },
            costume: {type: BaseTypes.TYPES.INT8},
            emote: {type: BaseTypes.TYPES.STRING},
            keydown: {type: BaseTypes.TYPES.STRING},
            room: {type: BaseTypes.TYPES.STRING}
        }, super.netScheme);
    }

    onAddToWorld(gameEngine) {
        if (Renderer) {
            Renderer.getInstance().addPlayer(this);
        }
    }

    onRemoveFromWorld(gameEngine) {
        if (Renderer) {
            Renderer.getInstance().removePlayer(this);
        }
    }

    toString() {
        return `Player::${super.toString()} color=${this.color} costume=${this.costume} emote=${this.emote} keydown=${this.keydown} room=${this.room}`;
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);

        var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.color = randomColor;

        this.costume = Math.floor(Math.random() * 6) + 1;

        this.emote = " ";
        this.keydown = " ";
        this.room = "/lobby"
    }

    // avoid gradual synchronization of velocity
    get bending() {
        return { velocity: { percent: 0.0 } };
    }

    syncTo(other) {
        super.syncTo(other);
        this.color = other.color;
        this.emote = other.emote;
        this.keydown = other.keydown;
        this.room = other.room;
    }
}