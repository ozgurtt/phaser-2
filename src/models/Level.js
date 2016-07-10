import Phaser from 'phaser'
import Tilemap from '../phaser/Tilemap'
import { Parameters } from '../configuration/parameters'

/*
    LEVEL
    Gestion de tout ce qui est en lien avec les tilesets, layers, pathfinding
 */
export default class {
  constructor (game, {tilemap, tilesets, layers, walkableLayer, walkableTiles, collisions}) {
    this.game = game;
    this.map = new Tilemap(this.game, tilemap);
    this.layers = {};
    this.walkableTiles = walkableTiles;
    this.collisions = collisions;
    
    tilesets.forEach((tileset) => {
      this.map.addTilesetImage(tileset.name, tileset.asset);
    });

    layers.forEach ((layer) => {
      this.layers[layer] = this.map.createLayer(layer);
    });

    this.walkableLayer = this.layers[walkableLayer];
    //this.walkableLayer.visible = false;
    this.walkableLayer.resizeWorld();
  }

  initPathfinder () {
    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    //@TODO this.pathfinder.enableDiagonals();
    this.pathfinder.setGrid(this.map.layers[this.walkableLayer.index].data, this.walkableTiles);
  }

  initCollisions () {
    //@TODO A tester
    // On définie sur quelles tuiles les colisions vont être détecté
    //this.map.setCollision([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], true, this.walkableLayer);
    //this.map.setCollision([16], true, this.walkableLayer);
    //this.map.setCollisionBetween(2, 16, true, this.walkableLayer);

    let m = this.map.layers[this.walkableLayer.index].data;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        let t = m[y][x];
        if (typeof this.collisions[t.index] !== 'undefined') {
          for (let z = 0; z < this.collisions[t.index].length; z++) {
            switch (this.collisions[t.index][z]) {
              case 't': t.collideUp = t.faceTop = true; break;
              case 'r': t.collideRight = t.faceRight = true; break;
              case 'b': t.collideDown = t.faceBottom = true; break;
              case 'l': t.collideLeft = t.faceLeft = true; break;
            }
          }
        }
      }
    }
  }

  calculatePath (fromX, fromY, toX, toY, onPathReadyCallback = (path) => {}) {
    let fromTile = this.getTile(fromX, fromY);
    let toTile = this.getTile(toX, toY);

    this.pathfinder.setCallbackFunction (onPathReadyCallback);
    this.pathfinder.preparePathCalculation ([fromTile.x, fromTile.y], [toTile.x, toTile.y]);
    this.pathfinder.calculatePath();
  }

  // En fonction du layer (récupérer le walkable layer)
  getTile (x, y, isCoordinate = false) {
    var m = isCoordinate ? Parameters.world.tile.size : 1;
    return {
      x: this.walkableLayer.getTileX(x) * m,
      y: this.walkableLayer.getTileY(y) * m
    }
  }

  add (object, layer) {
    // Choix de la couche sous laquel l'objet va être ajouté
    this.game.world.addAt(object, this.layers[layer].index);
  }
}
