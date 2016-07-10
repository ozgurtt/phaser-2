export let Levels = {
  map: {
    tilemap : 'world-map',
    tilesets: [
      {name: 'walkable', asset: 'tileset-walkable'},
      {name: 'tilesheet', asset: 'tileset-tilesheet'}
    ],
    layers: ['ground', 'floor0', 'floor1', 'walkable'],
    walkableLayer: 'walkable',
    walkableTiles: [481],
    collisions: {
      481: [],
      482: ['t'],
      483: ['r'],
      484: ['b'],
      485: ['l'],
      486: ['t','r','b','l'],
      487: ['t','r'],
      488: ['r','b'],
      489: ['b','l'],
      490: ['l','t'],
      491: ['t','b'],
      492: ['t','r','b'],
      493: ['r','b','l'],
      494: ['b','l','t'],
      495: ['l','t','r'],
      496: ['r','l']
    }
  }
};