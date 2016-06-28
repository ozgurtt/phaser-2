export let Parameters = {
  world: {
    width: 320,
    height: 320,
    tile: {
      size: 32
    }
  }
};

export let Assets = {
  font: false/*{
    google: {
      families: []
    }
  }*/,
  tilemap: {
    world: {
      level1: 'assets/tilemap/level1.json'
    }
  },
  sprites: {
    character: {
      mushroom: {image: 'assets/sprites/mushroom.png', json: 'assets/sprites/mushroom.json'}
    }
  },
  image: {
    object: {
      mushroom : 'assets/images/mushroom.png'
    },
    tileset: {
      walkable: 'assets/images/walkable.png',
      ground: 'assets/images/ground.png'
    }
  },
  audio: {
    
  }
};