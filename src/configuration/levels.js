export let Levels = {
  map: {
    tilesize: 128,
    tilemap : 'world-map',
    tilesets: [
      {name: 'walkable', asset: 'tilesheet-walkable'},
      {name: 'top', asset: 'tilesheet-top'},
      {name: 'exa', asset: 'tilesheet-exa'}
    ],
    layers: ['water', 'ground', 'floor0', 'floor1', 'walkable'],
    walkableLayer: 'walkable',
    walkableTiles: [1],
    collisions: {
      1: [],
      2: ['t','r','b','l'],
      3: ['t','b'],
      4: ['r','l'],
      5: ['t'],
      6: ['r'],
      7: ['b'],
      8: ['l'],
      9: ['t','r'],
      10: ['r','b'],
      11: ['b','l'],
      12: ['l','t'],
      13: ['t','r','b'],
      14: ['r','b','l'],
      15: ['b','l','t'],
      16: ['l','t','r'],
    }
  }
};