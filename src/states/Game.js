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
      tilemap : 'world-map',
      tilesets: [
        {name: 'walkable', asset: 'tileset-walkable'},
        {name: 'tilesheet', asset: 'tileset-tilesheet'}
      ],
      layers: ['walkables', 'ground', 'floor'],
      walkableLayer: 'walkables',
      walkableTiles: [1]
    });

    this.mushroom = new Mushroom(this.game, this.level, { x: 0, y: 0 });
    this.add.existing(this.mushroom);

    this.marker = this.game.add.graphics();
    this.marker.lineStyle(0);
    this.marker.beginFill(0x000000, 0.1);
    this.marker.drawRect(0, 0, Parameters.world.tile.size, Parameters.world.tile.size);
    this.marker.endFill();
    this.marker.inputEnabled = true;
    this.marker.events.onInputDown.add(() => {
      if (!this.mushroom.moving) {
        this.mushroom.moveTo(this.marker.x, this.marker.y);
      }
    });
  }

  render () {}
  update () {
    let activePointers = this.player.getActivePointers();
    let activeCursors = this.player.getActiveCursors();

    if (!this.mushroom.moving) {
      let activeTile = this.level.getTile (this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, true);
      this.marker.x = activeTile.x;
      this.marker.y = activeTile.y;
      this.marker.visible = this.game.input.activePointer.withinGame;
    }

    // TROUVER UN AUTRE MOYEN QUE LE SETTIMEOUT
    /*if(Object.keys(activePointers).length > 0 && !this.player.cursor.isDown && !this.mushroom.moving){
      console.log('-- POINTERS : ', activePointers);
      this.player.pointer.isDown = true;
      setTimeout(() => {this.player.pointer.isDown = false}, 500);

      var pointer = activePointers[Object.keys(activePointers)[0]];
      this.mushroom.moveTo(pointer.worldX, pointer.worldY);
    }

    if(Object.keys(activeCursors).length > 0){

      if(!this.player.cursor.isDown){
        console.log('-- CURSORS : ', activeCursors);
        clearTimeout(this.player.cursor.timeout);

        this.player.cursor.isDown = true;
        this.player.cursor.timeout = setTimeout(() => {this.player.cursor.isDown = false}, 500);
      }
    }*/
  }
}
