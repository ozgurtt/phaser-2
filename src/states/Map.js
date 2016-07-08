import Phaser from 'phaser'
import Level from '../models/Level'
import Player from '../models/Player'
import Character from '../models/Character'
import State from '../phaser/State'
import Text from '../phaser/Text'
import Tilemap from '../phaser/Tilemap'
import Mushroom from '../characters/Mushroom'
import { Parameters } from '../parameters'

export default class extends State {
  init (data = {}) {
    super.init(data);

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
    this.mushroom.scale.setTo(0.5);
    this.mushroom.anchor.setTo(-0.5);
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
  }
}
