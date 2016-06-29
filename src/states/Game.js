import Phaser from 'phaser'
import Level from '../models/Level'
import Player from '../models/Player'
import Character from '../models/Character'
import State from '../phaser/State'
import Text from '../phaser/Text'
import Tilemap from '../phaser/Tilemap'
import Mushroom from '../characters/Mushroom'
import { Parameters } from '../config'

export default class extends State {
  init () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.player = new Player(this.game, {
      'up': Phaser.KeyCode.UP,
      'down': Phaser.KeyCode.DOWN,
      'left': Phaser.KeyCode.LEFT,
      'right': Phaser.KeyCode.RIGHT
    });
  }

  create () {
    this.level = new Level(this.game, {
      tilemap : 'world-level1',
      tilesets: [
        {name: 'walkable', asset: 'tileset-walkable'},
        {name: 'ground', asset: 'tileset-ground'}
      ],
      layers: ['walkables', 'ground'],
      walkableLayer: 'walkables',
      walkableTiles: [5]
    });

    this.mushroom = new Mushroom(this.game, this.level, { x: 0, y: 0 });
    this.mushroom.scale.setTo(0.5, 0.5);
    this.add.existing(this.mushroom);
    this.mushroom.animations.play('test', 6, true);
  }

  render () {}
  update () {
    var activePointers = this.player.getActivePointers();

    if(Object.keys(activePointers).length > 0 && !this.player.pointer.isDown){
      console.log('-- POINTERS : ', activePointers);
      this.player.pointer.isDown = true;
      setTimeout(() => {this.player.pointer.isDown = false}, 500);

      var pointer = activePointers[Object.keys(activePointers)[0]];
      this.mushroom.moveTo(pointer.worldX, pointer.worldY);
    }

    var activeCursors = this.player.getActiveCursors();
    if(Object.keys(activeCursors).length > 0){

      if(!this.player.cursor.isDown){
        console.log('-- CURSORS : ', activeCursors);
        this.player.cursor.isDown = true;
        setTimeout(() => {this.player.cursor.isDown = false}, 500);
      }
    }
  }
}
