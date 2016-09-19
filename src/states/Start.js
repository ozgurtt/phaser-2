import Phaser from 'phaser';
import i18next from 'i18next';
import State from '../phaser/State';
import Text from '../phaser/Text';
import Player from '../models/Player';
import { Parameters } from '../configuration/parameters';
import { Data } from '../configuration/data';

export default class extends State {
  init () {
    super.init();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.player = new Player(this.game, {
      'up': Phaser.KeyCode.UP,
      'down': Phaser.KeyCode.DOWN,
      'left': Phaser.KeyCode.LEFT,
      'right': Phaser.KeyCode.RIGHT,
      'space': Phaser.KeyCode.SPACEBAR
    });
  }

  create () {
    this.game.scale.setResizeCallback(() => { this.onResize(); });

    this.textStart = new Text(this.game, {x: this.game.world.centerX, y: this.game.world.centerY, text: i18next.t('Start')}, {
      fontSize: '42px', fill: "#000", align: "center"});
    this.textStart.center();
    this.textStart.inputEnabled = true;
    this.add.existing(this.textStart);

    this.textStart.events.onInputOver.add(() => {
      this.textStart.fontSize = '50px';
    });
    this.textStart.events.onInputOut.add(() => {
      this.textStart.fontSize = '42px';
    });
    this.textStart.events.onInputDown.add(() => { this.startMap(); });

    this.game.input.keyboard.onDownCallback = (e) => {
      if (e.keyCode == Phaser.Keyboard.SPACEBAR) {
        this.startMap();
      }
    };
    this.startMap();
  }

  onResize() {
    this.game.paused = true;
    this.textStart.position.x = this.game.world.centerX;
    this.textStart.position.y = this.game.world.centerY;
    this.game.paused = false;
  }

  startMap () {
    let data = JSON.parse(localStorage.getItem(Parameters.storage.key));

    if(data !== null){
      for(var key in Data){
        if(typeof data[key] === 'undefined'){
          data = null;
          break;
        }
      }
    }
    if(data === null) data = Data;

    //console.log('load', data);
    let state = data.state === '' ? 'Map' : data.state;

    this.state.start(state, true, false, data);
  }

  update () {

  }
}
