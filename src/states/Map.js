import Phaser from 'phaser';
import State from '../phaser/State';
import Level from '../models/Level';
import Cthulhu from '../characters/Cthulhu';
import { Levels } from '../configuration/levels';
import { Parameters } from '../configuration/parameters';

export default class extends State {
  init (data = null) {
    data.state = 'Map';
    super.init(data);
  }

  create () {
    if(!this.game.device.desktop) this.game.kineticScrolling.start();

    // Initialisation du niveau Map
    this.level = new Level (this.game, Levels['map']);
    this.level.initPathfinder ();
    this.level.initCollisions ();

    // Initialisation du joueur
    this.characters['player'] = new Cthulhu(this.game, this.level, {layer: 'floor1', x: this.data.map.position.x, y: this.data.map.position.y});
    this.characters['player'].initCollisions ();

    // Initialisation du curseur de déplacement
    /*this.marker = this.game.add.graphics ();
    this.marker.lineStyle (0);
    this.marker.beginFill (0x000000, 0.1);
    this.marker.drawRect (0, 0, this.level.tilesize, this.level.tilesize);
    this.marker.endFill ();
    this.marker.inputEnabled = true;
    this.marker.visible = false;
    this.marker.events.onInputDown.add (() => {
      this.moveTo(this.marker.x, this.marker.y);
    });*/

    this.game.hammer.on("tap pan pinch swipe press", (e) => {
      switch(e.type){
        case 'tap':
          this.movePlayerTo (this.camera.view.left + e.center.x, this.camera.view.top + e.center.y);
          break;

        case 'pan':
          //console.log('pan', e);//e.deltaX, e.deltaY);
          break;

        case 'pinch':
          //console.log('pinch', this.game.world.scale, e.scale);
          break;
      }
    });

    // Vérification des évènements clavier
    this.game.input.keyboard.onDownCallback = (e) => {
      switch (e.keyCode) {
        case Phaser.Keyboard.ESC:
          break;
      }
    }
    this.game.input.mouse.mouseWheelCallback = (e) => {
      //this.game.input.mouse.wheelDelta;
    };
  }

  render () {
    let debugColor = 'rgba(0,0,0)';
    /*this.game.debug.inputInfo(32, 32, debugColor);
    this.game.debug.pointer( this.game.input.pointer1, true, debugColor, debugColor, debugColor);
    this.game.debug.pointer( this.game.input.pointer2, true, debugColor, debugColor, debugColor);/
    this.game.debug.bodyInfo(this.characters['player'], 32, 32, debugColor);
    this.game.debug.cameraInfo(this.game.camera, 32, 32, debugColor);*/
  }

  update () {
    // On récupère les entrées actives
    let activePointers = this.game.player.getActivePointers();
    let activeCursors = this.game.player.getActiveCursors();
    let activePointer = this.game.input.activePointer;

    // On définie les objets qui peuvent entrer en colision
    this.game.physics.arcade.collide(this.characters['player'], this.level.walkableLayer);

    if(activePointers.length > 0) {
      if(activePointers.length == 1) {
        /*if (!this.characters['player'].moving){
          // Mise à jour du marqueur
          let activeTile = this.level.getTile (this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, true);
          this.marker.x = activeTile.x;
          this.marker.y = activeTile.y;
          this.marker.visible = this.game.input.activePointer.withinGame;
        }*/
      }
    }

    if(activeCursors.length > 0) {
      // Déplacement de la caméra
      if (this.game.player.cursors.up.isDown) this.game.camera.y -= Parameters.camera.speed;
      if (this.game.player.cursors.right.isDown) this.game.camera.x += Parameters.camera.speed;
      if (this.game.player.cursors.down.isDown) this.game.camera.y += Parameters.camera.speed;
      if (this.game.player.cursors.left.isDown) this.game.camera.x -= Parameters.camera.speed;
    }
  }

  // Déplacement du personnage
  movePlayerTo(x, y){
    this.characters['player'].moveTo (x, y, () => {}, () => {
      let city = this.level.getObject ('cities', x, y);
      // Si le personnage termine son déplacement sur une ville
      if (city !== false) {
        let position = this.level.getTile(x, y);
        this.data.map.position = position;
        this.data.city = city;

        this.state.start('City', true, false, this.data);
      }
    });
  }
}
