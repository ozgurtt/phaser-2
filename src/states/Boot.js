import Phaser from 'phaser'
import State from '../phaser/State'
import WebFont from 'webfontloader'
import { Assets } from '../config'

export default class extends State {
  init () {
    this.fontsReady = false;

    let scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scale.setUserScale(scale, scale, 0, 0);
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVeritcally = true;
  }

  preload () {
    if (Assets.font) {
      Assets.font.active = () => { this.fontsReady = true };
      WebFont.load (Assets.font);
    }
    else this.fontsReady = true;
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash');
    }
  }
}
