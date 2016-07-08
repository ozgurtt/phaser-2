import Phaser from 'phaser'
import Tilemap from '../phaser/Tilemap'
import { Parameters } from '../parameters'

/*
    LEVEL
    Gestion de tout ce qui est en lien avec les tilesets, layers, pathfinding
 */
export default class {
  constructor (game, {tilemap, tilesets, layers, walkableLayer, walkableTiles, blockableTiles}) {
    this.game = game;
    this.map = new Tilemap(this.game, tilemap);
    this.layers = {};
    this.walkableLayer = walkableLayer;
    
    tilesets.forEach((tileset) => {
      this.map.addTilesetImage(tileset.name, tileset.asset);
    });

    var i = 0, walkableLayerIndex = 0;
    layers.forEach ((layer) => {
      this.layers[layer] = this.map.createLayer(layer);
    });

    this.walkableLayer = this.layers[walkableLayer];
    this.walkableLayer.visible = false;
    this.walkableLayer.resizeWorld();

    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    this.pathfinder.setGrid(this.map.layers[this.walkableLayer.index].data, walkableTiles);

    // On définie sur quelles tuiles les colisions vont être détecté
    this.map.setCollision(blockableTiles, true, this.walkableLayer);
  }

  setTilesCollision (layer, tiles = [], directions = {}) {
    let d = this.map.layers[this.layers[layer].index].data;
    directions = {
      top: typeof directions !== 'undefined' ? directions.top : false,
      bottom: typeof directions !== 'undefined' ? directions.bottom : false,
      left: typeof directions !== 'undefined' ? directions.left : false,
      right: typeof directions !== 'undefined' ? directions.right : false
    };

    for (var i = 0; i < d.length; i++) {
      for (var j = 0; j < d[i].length; j++) {
        let t = d[i][j];
        if (tiles.indexOf(t.index) > -1) {
          t.collideUp = directions.top;
          t.collideDown = directions.bottom;
          t.collideLeft = directions.left;
          t.collideRight = directions.right;

          t.faceTop = directions.top;
          t.faceBottom = directions.bottom;
          t.faceLeft = directions.left;
          t.faceRight = directions.right;
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
