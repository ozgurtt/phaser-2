import Phaser from 'phaser';
import i18next from 'i18next';
import Level from '../models/Level';
import State from '../phaser/State';

export default class extends State {
  init (data = null) {
    data.state = 'City';
    super.init(data);
  }

  create () {
    this.game.input.keyboard.onDownCallback = (e) => {
      if (e.keyCode == Phaser.Keyboard.SPACEBAR) {
        this.startMap();
      }
    }
  }

  startMap () {
    this.data.city = false;
    this.state.start('Map', true, false, this.data);
  }

  render () {

  }

  update () {

  }
}
