import Phaser from 'phaser';
import i18next from 'i18next';
import State from '../phaser/State';
import Text from '../phaser/Text';
import Player from '../models/Player';
import { Parameters } from '../configuration/parameters';

export default class extends State {
  init (data = {}) {
    super.init(data);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.data.player = new Player(this.game, {
      'up': Phaser.KeyCode.UP,
      'down': Phaser.KeyCode.DOWN,
      'left': Phaser.KeyCode.LEFT,
      'right': Phaser.KeyCode.RIGHT,
      'space': Phaser.KeyCode.SPACEBAR
    });
    this.data.city = false;
  }

  create () {
    let textStart = new Text(this.game, {x: this.game.world.centerX, y: this.game.world.centerY, text: i18next.t('Start')}, {
      fontSize: '42px', fill: "#000", align: "center"});
    textStart.center();
    textStart.inputEnabled = true;
    this.add.existing(textStart);


    textStart.events.onInputOver.add(() => {
      textStart.fontSize = '50px';
    });
    textStart.events.onInputOut.add(() => {
      textStart.fontSize = '42px';
    });
    textStart.events.onInputDown.add(() => { this.startMap(); });

    this.game.input.keyboard.onDownCallback = (e) => {
      if (e.keyCode == Phaser.Keyboard.SPACEBAR) {
        this.startMap();
      }
    }
  }

  startMap () {
    this.state.start('Map', true, false, this.data);
  }

  update () {

  }
}
