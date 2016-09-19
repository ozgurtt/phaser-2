import Phaser from 'phaser';
import i18next from 'i18next';
import WebFont from 'webfontloader';
import State from '../phaser/State';
import { Assets } from '../configuration/assets';
import { translations_fr } from '../translations/fr';
import { Parameters } from '../configuration/parameters';

export default class extends State {
  init () {
    this.fontsReady = false;
    this.translationsReady = false;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVeritcally = true;

    this.game.stage.disableVisibilityChange = true;

    // Optimisation mobile
    this.game.renderer.renderSession.roundPixels = true;
    this.game.time.desiredFps = 30;

    // Ajout des plugins
    this.game.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);

    // Ajout de Hammer
    this.game.hammer = new Hammer(document.getElementById(Parameters.dom.id));
    this.game.hammer.get('pinch').set({ enable: true });

    if(!this.game.device.desktop) {
      this.game.kineticScrolling = this.game.plugins.add (Phaser.Plugin.KineticScrolling);

      // Configuration des plugins
      this.game.kineticScrolling.configure ({
        kineticMovement: false,
        timeConstantScroll: 325,
        horizontalScroll: true,
        verticalScroll: true,
        horizontalWheel: false,
        verticalWheel: false,
        deltaWheel: 40
      });
    }
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
      this.state.start('Loading');
    }
  }
}
