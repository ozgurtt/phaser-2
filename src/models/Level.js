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
    this.map = new Tilemap(game, tilemap);
    this.layers = {};
    this.walkableLayer = walkableLayer;
    
    tilesets.forEach((tileset) => {
      this.map.addTilesetImage(tileset.name, tileset.asset);
    });

    var i = layers.length, walkableLayerIndex = 0;
    layers.forEach ((layer) => {
      this.layers[layer] = this.map.createLayer(layer);

      i--;
      if (layer === walkableLayer) { walkableLayerIndex = i; }
    });

    this.walkableLayer = this.layers[walkableLayer];
    this.walkableLayer.resizeWorld();
    
    this.walkableLayer;
    this.map.layers[walkableLayerIndex].data;
    walkableTiles;
    Parameters.world.tile.size;
  }

  // En fonction du layer (récupérer le walkable layer)
  getTile (pointer, isCoordinate) {
    var m = isCoordinate ? Parameters.world.tile.size : 1;
    return {
      x: this.walkableLayer.getTileX(pointer.worldX) * m,
      y: this.walkableLayer.getTileY(pointer.worldY) * m
    }
  }
}
