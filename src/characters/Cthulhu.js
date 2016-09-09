import Character from '../models/Character'

export default class extends Character {

  constructor (game, level, {layer, x, y}) {
    super(game, level, {layer:layer, x:x, y:y, asset:'character-cthulhu'});

    this.setupAnimations({
      stop_up: ['stop_up'],
      stop_right: ['stop_right'],
      stop_down: ['stop_down'],
      stop_left: ['stop_left'],
      walk_up: ['stop_up', 'walk_up_1', 'walk_up_2', 'walk_up_3', 'walk_up_2', 'walk_up_1', 'stop_up', 'walk_up_4', 'walk_up_5', 'walk_up_6', 'walk_up_5', 'walk_up_4'],
      walk_right: ['stop_right', 'walk_right_1', 'walk_right_2', 'walk_right_3', 'walk_right_2', 'walk_right_1', 'stop_right', 'walk_right_4', 'walk_right_5', 'walk_right_6', 'walk_right_5', 'walk_right_4'],
      walk_down: ['stop_down', 'walk_down_1', 'walk_down_2', 'walk_down_3', 'walk_down_2', 'walk_down_1', 'stop_down', 'walk_down_4', 'walk_down_5', 'walk_down_6', 'walk_down_5', 'walk_down_4'],
      walk_left: ['stop_left', 'walk_left_1', 'walk_left_2', 'walk_left_3', 'walk_left_2', 'walk_left_1', 'stop_left', 'walk_left_4', 'walk_left_5', 'walk_left_6', 'walk_left_5', 'walk_left_4'],
    });
  }

  update () {

  }

}
