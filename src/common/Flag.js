import {BaseTypes, DynamicObject, Renderer} from 'lance-gg';

export default class Flag extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            color: { type: BaseTypes.TYPES.STRING }
        }, super.netScheme);
    }

    onAddToWorld(gameEngine) {
        if (Renderer) {
            Renderer.getInstance().addFlag(this);
        }
    }

    onRemoveFromWorld(gameEngine) {
        if (Renderer) {
            Renderer.getInstance().removeObject(this);
        }
    }

    toString() {
        return `Flag::${super.toString()} color=${this.color}`;
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.color = "#ffffff";
    }


    syncTo(other) {
        super.syncTo(other);
        this.color = other.color;
    }

}