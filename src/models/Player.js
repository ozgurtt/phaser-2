import Phaser from 'phaser'
import { Parameters } from '../parameters'

export default class {
  constructor (game, keycodes, pointers = 2) {
    this.game = game;
    this.initInputs(keycodes, pointers);
  }

  initInputs (keycodes, pointers = 2){
    this.keycodes = keycodes;
    this.cursors = this.game.input.keyboard.addKeys(this.keycodes);

    if(pointers > this.game.input.pointers.length){
      for (var i = this.game.input.pointers.length; i < pointers; i++) {
        this.game.input.addPointer();
      }
    }
  }

  getActivePointers () {
    let activePointerIds = {};
    let activePointers = [];

    if (this.game.input.activePointer.isDown){
      activePointerIds[this.game.input.activePointer.id] = true;
      activePointers.push(this.game.input.activePointer);
    }

    if (this.game.input.totalActivePointers > 0){
      this.game.input.pointers.forEach (function (pointer, index, pointers) {
        if(pointer.isDown && typeof activePointerIds[pointer.id] === 'undefined') {
          activePointerIds[pointer.id] = true;
          activePointers.push(pointer);
        }
      });
    }

    return activePointers;
  }

  getActiveCursors () {
    var activeCursors = [];

    for(var id in this.keycodes){
      if (this.cursors[id].isDown)  activeCursors[this.cursors[id].keyCode]     = this.cursors[id];
    }

    return activeCursors;
  }
}
