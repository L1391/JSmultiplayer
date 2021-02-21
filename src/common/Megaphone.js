import {BaseTypes, DynamicObject, Renderer} from 'lance-gg';

export default class Megaphone extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            message: {type: BaseTypes.TYPES.STRING},
            isBroadcasting: {type: BaseTypes.TYPES.INT8}
        }, super.netScheme);
    }

    onAddToWorld(gameEngine) {
        console.log("added to world");
        if (Renderer) {
            Renderer.getInstance().addMegaphone(this);
        }
    }

    onRemoveFromWorld(gameEngine) {
        if (Renderer) {
            Renderer.getInstance().removeObject(this);
        }
    }

    toString() {
        return `Megaphone::${super.toString()} message=${this.message} isBroadcasting=${this.isBroadcasting}`;
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.message = " ";
        this.isBroadcasting = 0;
    }


    syncTo(other) {
        super.syncTo(other);
        this.message = other.message;
        this.isBroadcasting = other.isBroadcasting;
    }

}