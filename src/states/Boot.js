import Phaser from 'phaser';
import State from '../phaser/State';
import WebFont from 'webfontloader';
import i18next from 'i18next';
import { Assets } from '../assets';
import { translations_fr } from '../translations/fr';

export default class extends State {
  init () {
    this.fontsReady = false;
    this.translationsReady = false;

    let scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scale.setUserScale(scale, scale, 0, 0);
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVeritcally = true;
  }

  preload () {
    i18next.init({
      lng: 'fr',
      resources: {
        fr: { translation : translations_fr }
      }
    }, (err, t) => {
      this.translationsReady = true;
    });

    if (Assets.font) {
      Assets.font.active = () => { this.fontsReady = true };
      WebFont.load (Assets.font);
    }
    else this.fontsReady = true;
  }

  render () {
    if (this.fontsReady && this.translationsReady) {
      this.state.start('Splash');
    }
  }
}
