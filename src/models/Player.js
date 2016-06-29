import Phaser from 'phaser'
import { Parameters } from '../config'

export default class {
  constructor (game, keycodes, pointers = 2) {
    this.game = game;
    this.initInputs(keycodes, pointers);
  }

  initInputs (keycodes, pointers = 2){
    this.keycodes = keycodes;
    this.cursors = this.game.input.keyboard.addKeys(this.keycodes);
    this.pointer = {x: 0, y: 0, isDown: false};
    this.cursor = {isDown: false};

    if(pointers > this.game.input.pointers.length){
      for (var i = this.game.input.pointers.length; i < pointers; i++) {
        this.game.input.addPointer();
      }
    }
  }

  getActivePointers () {
    let activePointers = {};

    if (this.game.input.activePointer.isDown){
      activePointers[this.game.input.activePointer.id] = this.game.input.activePointer;
    }

    if (this.game.input.totalActivePointers > 0){
      this.game.input.pointers.forEach (function (pointer, index, pointers) {
        if(pointer.isDown) {
          activePointers[pointer.id] = pointer;
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
