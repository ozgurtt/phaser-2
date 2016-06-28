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
    this.initCursor();
  }

  initCursor (){
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = {x: 0, y: 0};
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
    //this.player = new Player(this.game, this.level);

    this.mushroom = new Mushroom(this.game, this.level, { x: 0, y: 0 });
    this.mushroom.scale.setTo(0.5, 0.5);
    this.add.existing(this.mushroom);
  }

  render () {}
  update () {
    if(this.input.activePointer.isDown){
      this.mushroom.moveTo(this.input.activePointer.worldX, this.input.activePointer.worldY);
    }
  }
}
