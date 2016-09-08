import Phaser from 'phaser';

export default class extends Phaser.State {
  init (data = {}) {
    this.data = data;
    this.characters = [];
  }
  preload () {}
  create () {}
  update () {}
  render () {}
  shutdown () {}
}
