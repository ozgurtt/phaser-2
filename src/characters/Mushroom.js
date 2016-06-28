import Character from '../models/Character'

export default class extends Character {

  constructor (game, level, {x, y}) {
    super(game, level, {x:x, y:y, asset:'character-mushroom'});

    this.setupAnimations({
      test: ['bottom', 'top']
    });

    //this.animations.play("test", 6, true);
    //this.moveTo(9, 9);
  }

  update () {

  }

}
