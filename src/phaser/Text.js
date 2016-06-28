import Phaser from 'phaser'

export default class extends Phaser.Text {

  constructor (game, {x, y, text}) {
    super(game, x, y, text);
  }

  // Défini l'origine au centre
  center () {
    this.anchor.setTo(0.5);
  }
}
