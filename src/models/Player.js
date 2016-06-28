import Phaser from 'phaser'
import { Parameters } from '../config'

export default class {
  constructor (game, level) {
    this.game = game;
    this.level = level;
  }

  getActivesPointers () {
    if (this.game.input.totalActivePointers > 0){
      if (this.game.input.totalActivePointers == 1){
        return [this.game.input.activePointer];
      }

      let activePointers = [];
      this.game.input.pointers.forEach (function (pointer, index, pointers) {
        if(pointer.isDown) {
          activePointers.push(pointer);
        }
      });
      return activePointers;
    }
    return [];
  }
}
