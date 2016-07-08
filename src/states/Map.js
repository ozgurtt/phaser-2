import Phaser from 'phaser'
import i18next from 'i18next';
import Level from '../models/Level';
import State from '../phaser/State';
import Mushroom from '../characters/Mushroom';
import { Parameters } from '../parameters';

export default class extends State {
  init (data = {}) {
    super.init(data);
  }

  create () {
    this.data.level['map'] = new Level(this.game, {
      tilemap : 'world-map',
      tilesets: [
        {name: 'walkable', asset: 'tileset-walkable'},
        {name: 'tilesheet', asset: 'tileset-tilesheet'}
      ],
      layers: ['walkables', 'ground', 'floor', 'tall'],
      walkableLayer: 'walkables',
      walkableTiles: [1],
      blockableTiles: [2]
    });

    this.mushroom = new Mushroom(this.game, this.data.level['map'], { x: 0, y: 0 });
    this.mushroom.scale.setTo(0.5);
    this.mushroom.anchor.setTo(-0.5);

    this.data.level['map'].add(this.mushroom, 'tall');
    
    this.game.camera.follow(this.mushroom);
    this.game.physics.enable(this.mushroom, Phaser.Physics.ARCADE);
    this.mushroom.body.collideWorldBounds = true;
    //this.mushroom.body.gravity.y = 10; 

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

  render () {

  }

  update () {
    let activePointers = this.data.player.getActivePointers();
    let activeCursors = this.data.player.getActiveCursors();

    // On définie les objets qui peuvent entrer en colision
    this.game.physics.arcade.collide(this.mushroom, this.data.level['map'].walkableLayer);

    if (!this.mushroom.moving) {
      let activeTile = this.data.level['map'].getTile (this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, true);
      this.marker.x = activeTile.x;
      this.marker.y = activeTile.y;
      this.marker.visible = this.game.input.activePointer.withinGame;
    }
  }
}
