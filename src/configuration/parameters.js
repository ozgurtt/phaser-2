import Human from '../characters/Human';
import Cthulhu from '../characters/Cthulhu';

export let Parameters = {
  world: {
    width: 960,
    height: 540,
    tile: {
      size: 128
    }
  },
  characters: {
    Human,
    Cthulhu,
  }
};