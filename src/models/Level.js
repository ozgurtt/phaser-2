import Phaser from 'phaser'
import Tilemap from '../phaser/Tilemap'
import { Parameters } from '../config'

/*
    LEVEL
    Gestion de tout ce qui est en lien avec les tilesets, layers, pathfinding
 */
export default class {
  constructor (game, {tilemap, tilesets, layers, walkableLayer, walkableTiles}) {
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

      if (layer === walkableLayer) { walkableLayerIndex = i; }
      i++;
    });

    this.walkableLayer = this.layers[walkableLayer];
    this.walkableLayer.visible = false;
    this.walkableLayer.resizeWorld();

    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    this.pathfinder.setGrid(this.map.layers[walkableLayerIndex].data, walkableTiles);
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
}
