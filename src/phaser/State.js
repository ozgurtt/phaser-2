import Phaser from 'phaser';
import Level from '../models/Level';
import { Levels } from '../configuration/levels';

export default class extends Phaser.State {
  init (data = {}) {
    this.data = data;
  }
  preload () {}
  create () {}
  update () {}
  render () {}
  shutdown () {}
  
  initLevel (level) {
    this.level = new Level (this.game, Levels[level]);
    this.characters = [];
    
    /*if(typeof this.data.levels[level] === 'undefined'){
      this.data.levels[level] = {
        current: true,
        ent: {
          x: 0,
          y: 0
        }
      };
    }
    
    if(typeof Levels[level].start !== 'undefined'){
      this.data.levels[level].start = Levels[level].start;
    }*/
  }
}
