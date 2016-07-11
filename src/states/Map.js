import Phaser from 'phaser';
import i18next from 'i18next';
import State from '../phaser/State';
import Character from '../models/Character';
import { Parameters } from '../configuration/parameters';

export default class extends State {
  init (data = {}) {
    super.init(data);

    this.level = 'map';
  }

  create () {
    this.initLevel('map');

    console.log(Character);

    this.characters['player'] = new Parameters.characters['Mushroom'](this.game, this.level, {x: 2, y: 2});
    this.characters['player'].scale.setTo (0.5);
    this.characters['player'].initCamera ();
    this.characters['player'].initPhysics ();
    this.characters['player'].body.collideWorldBounds = true;
    //this.characters['player'].anchor.setTo(-0.5);
    //this.characters['player'].body.gravity.y = 10;

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
          this.startCity(city);
        }
      }
    });

    this.game.input.keyboard.onDownCallback = (e) => {
      if (e.keyCode == Phaser.Keyboard.SPACEBAR) {
        let city = this.level.getNearObject('cities', this.characters['player'])
        if(city !== false){
          this.startCity(city);
        }
      }
    }
  }

  startCity (city) {
    this.data.city = city;
    this.state.start('City', true, false, this.data);
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
      this.characters['player'].resetCurrentTweens();

      if (this.data.player.cursors.up.isDown) this.characters['player'].move('up');
      if (this.data.player.cursors.right.isDown) this.characters['player'].move('right');
      if (this.data.player.cursors.down.isDown) this.characters['player'].move('down');
      if (this.data.player.cursors.left.isDown) this.characters['player'].move('left');
    }
  }
}
