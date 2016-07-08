import Phaser from 'phaser'

export default class extends Phaser.State {
  init (data = {}) {
    this.data = data;
  }
  preload () {}
  create () {}
  update () {}
  render () {}
  shutdown () {}
}
