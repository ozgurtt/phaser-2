import 'pixi';
import 'p2';
import Phaser from 'phaser';
import EasyStar from 'easystar';
import 'phaser_easystar';
import 'phaser_kinecticscrolling';
import 'hammerjs';

import BootState from './states/Boot';
import LoadingState from './states/Loading';
import StartState from './states/Start';
import MapState from './states/Map';
import CityState from './states/City';
import { Parameters } from './configuration/parameters';

class Game extends Phaser.Game {

  constructor () {
    super(window.innerWidth, window.innerHeight, Phaser.AUTO, Parameters.dom.id, null, true);

    this.state.add('Boot', BootState, false);
    this.state.add('Loading', LoadingState, false);
    this.state.add('Start', StartState, false);
    this.state.add('Map', MapState, false);
    this.state.add('City', CityState, false);

    this.state.start('Boot')
  }
}

window.game = new Game();
