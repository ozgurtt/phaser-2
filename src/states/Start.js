import Phaser from 'phaser';
import State from '../phaser/State';
import Text from '../phaser/Text';
import i18next from 'i18next';
import { Parameters } from '../parameters';

export default class extends State {
  init (data = {}) {
    super.init(data);
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
    textStart.events.onInputDown.add(() => {
      this.state.start('Map', true, false, {});
    });

  }

  render () {}
  update () {

  }
}
