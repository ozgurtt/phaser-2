import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor (game, x, y, asset) {
    super(game, x, y, asset)
  }

  setResponsiveWidth (percent, parent)  {
    let percentWidth = (this.texture.width - (parent.width / (100 / percent))) * 100 / this.texture.width
    this.width = parent.width / (100 / percent)
    this.height = this.texture.height - (this.texture.height * percentWidth / 100)
  }
}
