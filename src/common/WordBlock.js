import {BaseTypes, DynamicObject, Renderer} from 'lance-gg';

export default class WordBlock extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            character: { type: BaseTypes.TYPES.STRING }
        }, super.netScheme);
    }

    onAddToWorld(gameEngine) {
        if (Renderer) {
            Renderer.getInstance().addWordBlock(this);
        }
    }

    onRemoveFromWorld(gameEngine) {
        if (Renderer) {
            Renderer.getInstance().removeObject(this);
        }
    }

    toString() {
        return `WordBlock::${super.toString()} character=${this.character}`;
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.character = " ";
    }


    syncTo(other) {
        super.syncTo(other);
        this.character = other.character;
    }

}