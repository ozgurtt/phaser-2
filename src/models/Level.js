import Phaser from 'phaser'
import Tilemap from '../phaser/Tilemap'
import { Parameters } from '../configuration/parameters'

/*
    LEVEL
    Gestion de tout ce qui est en lien avec les tilesets, layers, pathfinding
 */
export default class {
  constructor (game, {tilemap, tilesets, layers, walkableLayer, collisions}) {
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

    // On définie sur quelles tuiles les colisions vont être détecté
    //this.map.setCollision(collisions.full, true, this.walkableLayer);
    this.initPathfinder(walkableLayer, collisions)
  }

  // On multiplie la grille par 3 pour gérer les blocages des tuiles sur uniquement quelques cotés
  initPathfinder (layer, collisions_tiles) {
    let data = this.map.layers[this.layers[layer].index].data;

    let m = [];
    for (let y = 0; y < data.length; y++) {
      let r = [];
      for (let x = 0; x < data[y].length; x++) {
        let i = data[y][x].index;

        let collisions = collisions_tiles[i];
        let p = [
          [1, 0, 1],
          [0, 0, 0],
          [1, 0, 1]
        ];

        for (let z = 0; z < collisions.length; z++) {
          switch (collisions[z]) {
            case 't': p[0][0] = 1; p[0][1] = 1; p[0][2] = 1; break;
            case 'r': p[0][2] = 1; p[1][2] = 1; p[2][2] = 1; break;
            case 'b': p[2][0] = 1; p[2][1] = 1; p[2][2] = 1; break;
            case 'l': p[0][0] = 1; p[1][0] = 1; p[2][0] = 1; break;
          }
        }
        r.push(p);
      }
      m.push(r);
    }

    let tab = [];
    for (let y = 0; y < m.length * m[0][0].length; y++) {
      let row = [];
      for (let x = 0; x < m[0].length * m[0][0][0].length; x++)
        row.push(0);
      tab.push(row);
    }

    for (let y = 0; y < m.length; y++)
      for (let x = 0; x < m[y].length; x++)
        for (let j = 0; j < m[y][x].length; j++)
          for (let i = 0; i < m[y][x][j].length; i++)
            tab[y * m[0][0].length + j][x * m[0][0][0].length + i] = {index: m[y][x][j][i]};

    this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    this.pathfinder.setGrid(tab, [0]);
    //this.pathfinder.setGrid(this.map.layers[this.layers[layer].index].data, [1]);
  }

  /*setCollisions (layer, tiles = [], directions = {}) {
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
  }*/

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
