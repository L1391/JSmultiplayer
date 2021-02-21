import {BaseTypes, DynamicObject, Renderer} from 'lance-gg';

export default class Door extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            toRoom: { type: BaseTypes.TYPES.STRING },
            fromRoom: {type: BaseTypes.TYPES.STRING },
            radius: {type: BaseTypes.TYPES.INT8}
        }, super.netScheme);
    }

    onAddToWorld(gameEngine) {
        // if (Renderer) {
        //     Renderer.getInstance().addDoor(this);
        // }
    }

    toString() {
        return `Door::${super.toString()} toRoom=${this.toRoom} fromRoom=${this.fromRoom} radius=${this.radius}`;
    }


    syncTo(other) {
        super.syncTo(other);
        this.toRoom = other.toRoom;
        this.fromRoom = other.fromRoom;
        this.radius = other.radius;
    }

}