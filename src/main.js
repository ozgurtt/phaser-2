import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import { Parameters } from './config';

class Game extends Phaser.Game {

  constructor () {
    super(Parameters.world.width, Parameters.world.height, Phaser.AUTO, 'content', null, true);

    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('Game', GameState, false);

    this.state.start('Boot')
  }
}

window.game = new Game();
