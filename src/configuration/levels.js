export let Levels = {
  map: {
    tilemap : 'world-map',
    tilesets: [
      {name: 'walkable', asset: 'tileset-walkable'},
      {name: 'tilesheet', asset: 'tileset-tilesheet'}
    ],
    layers: ['ground', 'floor', 'tall', 'walkables'],
    walkableLayer: 'walkables',
    collisions: {
      0: [],
      1: [],
      2: ['t'],
      3: ['r'],
      4: ['b'],
      5: ['l'],
      6: ['t','r'],
      7: ['r','b'],
      8: ['b','l'],
      9: ['l','t'],
      10: ['t','r','b'],
      11: ['r','b','l'],
      12: ['b','l','t'],
      13: ['l','t','r'],
      14: ['t','b'],
      15: ['r','l'],
      16: ['t','r','b','l']
    }
  }
};