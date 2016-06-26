import Phaser from 'phaser'
import State from '../phaser/State'
import Mushroom from '../sprites/Mushroom'

export default class extends State {
  create () {
    let banner = this.add.text(this.game.world.centerX, this.game.height - 30, 'Phaser + ES6 + Webpack')
    banner.font = 'Nunito'
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom(this.game, {
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'character-mushroom'
    })

    //this.mushroom.setResponsiveWidth(30, this.world)
    this.add.existing(this.mushroom)
  }

  render () {

  }

  update () {

  }
}
