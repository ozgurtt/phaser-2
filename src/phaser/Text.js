import Phaser from 'phaser'

export default class extends Phaser.Text {

  constructor (game, {x, y, text}, properties = {}) {
    super(game, x, y, text, properties);
  }

  // Défini l'origine au centre
  center () {
    this.anchor.setTo(0.5);
  }
}
