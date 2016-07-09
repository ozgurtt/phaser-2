import 'pixi';
import 'p2';
import Phaser from 'phaser';
import EasyStar from 'easystar';
import 'easystar_phaser';

import BootState from './states/Boot';
import LoadingState from './states/Loading';
import StartState from './states/Start';
import MapState from './states/Map';
import { Parameters } from './configuration/parameters';

class Game extends Phaser.Game {

  constructor () {
    super(Parameters.world.width, Parameters.world.height, Phaser.AUTO, 'content', null, true);

    this.state.add('Boot', BootState, false);
    this.state.add('Loading', LoadingState, false);
    this.state.add('Start', StartState, false);
    this.state.add('Map', MapState, false);

    this.state.start('Boot')
  }
}

window.game = new Game();
