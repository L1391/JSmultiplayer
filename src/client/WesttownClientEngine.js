import {ClientEngine, KeyboardControls} from 'lance-gg';
import WesttownRenderer from '../client/WesttownRenderer';

export default class WesttownClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, WesttownRenderer);

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up', { repeat: true } );
        this.controls.bindKey('down', 'down', { repeat: true } );
        this.controls.bindKey('left','left', { repeat: true } );
        this.controls.bindKey('right','right', { repeat: true } );

    }

}