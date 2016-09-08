import Phaser from 'phaser';
import Tilemap from '../phaser/Tilemap';
import { Parameters } from '../configuration/parameters';

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
    this.walkableLayer.visible = false;
    this.walkableLayer.resizeWorld();
  }

  initPathfinder () {
    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    this.pathfinder.setGrid(this.map.layers[this.walkableLayer.index].data, this.walkableTiles);
  }

  initCollisions () {
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
  
  debugCollisions () {
    this.walkableLayer.visible = true;
    this.walkableLayer.debug = true;
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
    let m = isCoordinate ? Parameters.world.tile.size : 1;
    return {
      x: this.walkableLayer.getTileX(x) * m,
      y: this.walkableLayer.getTileY(y) * m
    }
  }

  getTiles (object, isCoordinate = false) {
    let tiles = [];
    let tiles_index = [];

    for(let x = object.x; x <= object.x + object.width - 1; x += object.width - 1){
      for(let y = object.y; y <= object.y + object.height - 1; y += object.height - 1){
        let tile = this.getTile(x, y, isCoordinate);
        let index = tile.x + ':' + tile.y;

        if(tiles_index.indexOf(index) === -1){
          tiles_index.push(index);
          tiles.push(tile)
        }
      }
    }
    return tiles;
  }

  getObject (layer, x, y) {
    let tile = this.getTile(x, y);
    let object = false;

    this.map.objects[layer].some((city) => {
      let tilesCity = this.getTiles(city);

      tilesCity.some((tileCity) => {
        if(tileCity.x === tile.x && tileCity.y === tile.y){
          object = city;
          return true;
        }
        return false;
      });
      return object !== false;
    });

    return object;
  }

  getNearObject (layer, character) {
    let tilesCharacter = character.getTiles ();
    let object = false;

    this.map.objects[layer].some((city) => {
      let tilesCity = this.getTiles(city);

      tilesCity.some((tileCity) => {
        tilesCharacter.some((tileCharacter) => {
          if(tileCharacter.x <= tileCity.x + 1 && tileCharacter.x >= tileCity.x - 1 &&
            tileCharacter.y <= tileCity.y + 1 && tileCharacter.y >= tileCity.y - 1){

            object = city;
            return true;
          }
          return false;
        });
        return object !== false;
      });
      return object !== false;
    });

    return object;
  }

  add (object, layer) {
    // Choix de la couche sous laquel l'objet va être ajouté
    this.game.world.addAt(object, this.layers[layer].index);
  }
}
