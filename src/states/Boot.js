import Phaser from 'phaser'
import State from '../phaser/State'
import WebFont from 'webfontloader'
import { Assets } from '../config'

export default class extends State {
  init () {
    this.fontsReady = false

    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    let scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height)
    this.scale.setUserScale(scale, scale, 0, 0)
  }

  preload () {
    Assets.font.active = () => {this.fontsReady = true}
    WebFont.load(Assets.font)
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }
}
