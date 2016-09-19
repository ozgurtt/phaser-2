import Phaser from 'phaser';
import { Parameters } from '../configuration/parameters';

export default class extends Phaser.State {
  init (data = null) {
    this.data = data;
    this.characters = [];
    this.save();
  }
  save () {
    if(this.data !== null) {
      //console.log('save', this.data);
      localStorage.setItem (Parameters.storage.key, JSON.stringify (this.data));
    }
  }
  preload () {}
  create () {}
  update () {}
  render () {}
  shutdown () {}
}
