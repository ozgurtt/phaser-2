import Phaser from 'phaser';
import State from '../phaser/State';
import Level from '../models/Level';
import { Levels } from '../configuration/levels';
import { Parameters } from '../configuration/parameters';

export default class extends State {
  init (data = {}) {
    super.init(data);
  }

  create () {
    this.level = new Level (this.game, Levels['map']);

    this.characters['player'] = new Parameters.characters['Cthulhu'](this.game, this.level, {x: 2, y: 2});
    this.characters['player'].initCamera ();
    this.characters['player'].initPhysics ();
    this.characters['player'].body.collideWorldBounds = true;
    this.characters['player'].play('walk_up', 5, true);

    this.level.add (this.characters['player'], 'floor1');
    this.level.initPathfinder ();
    this.level.initCollisions ();

    this.marker = this.game.add.graphics ();
    this.marker.lineStyle (0);
    this.marker.beginFill (0x000000, 0.1);
    this.marker.drawRect (0, 0, Parameters.world.tile.size, Parameters.world.tile.size);
    this.marker.endFill ();
    this.marker.inputEnabled = true;
    this.marker.events.onInputDown.add (() => {
      //console.log ('-- CLICK : ', this.level.getTile (this.marker.x, this.marker.y));
      this.characters['player'].moveTo (this.marker.x, this.marker.y);


      let city = this.level.getObject('cities', this.marker.x, this.marker.y)
      if(city !== false){
        console.log ('-- CITY : ', city);

        if(this.level.getNearObject('cities', this.characters['player']) !== false) {

        }
      }
    });

    this.game.input.keyboard.onDownCallback = (e) => {
      if (e.keyCode == Phaser.Keyboard.SPACEBAR) {
        let city = this.level.getNearObject('cities', this.characters['player'])
        if(city !== false){

        }
      }
    }

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  render () {

  }

  update () {
    let activePointers = this.data.player.getActivePointers();
    let activeCursors = this.data.player.getActiveCursors();

    // On définie les objets qui peuvent entrer en colision
    this.game.physics.arcade.collide(this.characters['player'], this.level.walkableLayer);

    this.characters['player'].stop();

    if (!this.characters['player'].moving) {
      let activeTile = this.level.getTile (this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, true);
      this.marker.x = activeTile.x;
      this.marker.y = activeTile.y;
      this.marker.visible = this.game.input.activePointer.withinGame;
    }

    if(activeCursors.length > 0){
      /*this.characters['player'].setSpeed(100);*/
      var cameraSpeed = 1.9;

      this.characters['player'].resetCurrentTweens();
      if (this.data.player.cursors.up.isDown) this.characters['player'].move('up');
      if (this.data.player.cursors.right.isDown) this.characters['player'].move('right');
      if (this.data.player.cursors.down.isDown) this.characters['player'].move('down');
      if (this.data.player.cursors.left.isDown) this.characters['player'].move('left');
    }

    /*if (this.cursors.up.isDown) this.camera.y -= cameraSpeed;
     if (this.cursors.right.isDown) this.camera.x += cameraSpeed;
     if (this.cursors.down.isDown) this.camera.y += cameraSpeed;
     if (this.cursors.left.isDown) this.camera.x -= cameraSpeed;*/
  }
}
