import Phaser from 'phaser';
import State from '../phaser/State';
import Level from '../models/Level';
import Cthulhu from '../characters/Cthulhu';
import { Levels } from '../configuration/levels';
import { Parameters } from '../configuration/parameters';

export default class extends State {
  init (data = {}) {
    super.init(data);
  }

  create () {
    this.level = new Level (this.game, Levels['map']);
    this.level.initPathfinder ();
    this.level.initCollisions ();

    this.characters['player'] = new Cthulhu(this.game, this.level, {layer: 'floor1', x: 2, y: 2});
    this.characters['player'].initPhysics ();
    this.characters['player'].initCollisions ();

    if(this.game.device.desktop) {
      this.marker = this.game.add.graphics ();
      this.marker.lineStyle (0);
      this.marker.beginFill (0x000000, 0.1);
      this.marker.drawRect (0, 0, Parameters.world.tile.size, Parameters.world.tile.size);
      this.marker.endFill ();
      this.marker.inputEnabled = true;

      // Verification des évènements souris
      this.marker.events.onInputDown.add (() => {
        // Déplacement à la souris
        this.moveTo(this.marker.x, this.marker.y);
      });

      // Vérification des évènements clavier
      this.game.input.keyboard.onDownCallback = (e) => {
        switch (e.keyCode) {
          case Phaser.Keyboard.ESC:
            break;
        }
      }
    }


  }

  render () {
    let debugColor = 'rgba(0,0,0)';
    this.game.debug.inputInfo(32, 32, debugColor);
    this.game.debug.pointer( this.game.input.activePointer, true, debugColor, debugColor, debugColor);
  }

  update () {
    // On récupère les entrées actives
    let activePointers = this.data.player.getActivePointers();
    let activeCursors = this.data.player.getActiveCursors();

    // On définie les objets qui peuvent entrer en colision
    this.game.physics.arcade.collide(this.characters['player'], this.level.walkableLayer);

    if (this.game.device.desktop) {
      // Mise à jour du marqueur
      let activeTile = this.level.getTile (this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, true);
      this.marker.x = activeTile.x;
      this.marker.y = activeTile.y;
      this.marker.visible = this.game.input.activePointer.withinGame;
    }
    else{
      if(activePointers.length > 0) {
        console.log(activePointers);
        // Déplacement au touch
        if (activePointers.length == 1) {
          this.moveTo (activePointers[0].x, activePointers[0].y);
        }
      }
    }

    if(activeCursors.length > 0) {
      // Déplacement de la caméra
      if (this.data.player.cursors.up.isDown) this.camera.y -= Parameters.world.camera.speed;
      if (this.data.player.cursors.right.isDown) this.camera.x += Parameters.world.camera.speed;
      if (this.data.player.cursors.down.isDown) this.camera.y += Parameters.world.camera.speed;
      if (this.data.player.cursors.left.isDown) this.camera.x -= Parameters.world.camera.speed;
    }
  }

  // Déplacement du personnage
  moveTo(x, y){
    this.characters['player'].moveTo (x, y, () => {}, () => {
      let city = this.level.getObject ('cities', x, y);
      // Si le personnage termine son déplacement sur une ville
      if (city !== false) {
        console.log ('-- CITY : ', city);
      }
    });
  }
}
