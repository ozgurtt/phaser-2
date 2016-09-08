import Phaser from 'phaser';
import Sprite from '../phaser/Sprite';
import { Parameters } from '../configuration/parameters'

export default class extends Sprite {
  constructor (game, level, {x, y, asset, isCollisionEnabled = true, speed = 100}) {
    super(game, {x: x * Parameters.world.tile.size, y: y * Parameters.world.tile.size, asset});
    this.game = game;
    this.level = level;

    this.setSpeed(speed);

    this.currentTweens = [];
    this.moving = false;
    this.tweenInProgress = false;

    if(isCollisionEnabled){
      this.game.physics.enable(this);
      this.body.fixedRotation = true;
    }
  }

  initPhysics () {
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  initCamera () {
    this.game.camera.follow(this);
  }

  setupAnimations (animations) {
    for (var key in animations) {
      this.animations.add(key, animations[key]);
    }
  }

  play(key, duration, isLoop = false){
    if(typeof duration == 'undefined') duration = this.animDuration;

    this.animations.play(key, duration, isLoop);
  }

  setSpeed (speed) {
    this.moveSpeed = speed; // 100
    this.moveDuration = 300 * 100 / speed; // 300
    this.animDuration = speed / 10; // 10
  }

  stop () {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  move (direction) {
    switch (direction) {
      case 'up': this.body.velocity.y = - this.moveSpeed; break;
      case 'right': this.body.velocity.x = this.moveSpeed; break;
      case 'down': this.body.velocity.y = this.moveSpeed; break;
      case 'left': this.body.velocity.x = - this.moveSpeed; break;
    }
  }

  moveTo (targetX, targetY, pathReadyCallback = (path) => {}, pathEndedCallback = () => {}) {
    this.level.calculatePath(
      this.position.x,
      this.position.y,
      targetX,
      targetY,
      (path) => {
        if(path !== null) {
          pathReadyCallback(path);
          this.onReadyToMove(path, () => {
            pathEndedCallback();
          });
        }
      }
    );
  }

  onReadyToMove (path = [], pathEndedCallback = () => {}) {
    this.resetCurrentTweens();
    this.prepareMovement(path);
    this.moveInPath(pathEndedCallback);
  }

  resetCurrentTweens () {
    this.currentTweens.map((tween) => {
      this.game.tweens.remove(tween);
    });
    this.currentTweens = [];
    this.moving = false;
    this.animations.stop();
  }

  prepareMovement (path = []) {
    this.currentTweens = [];

    path.map((point) => {
      this.currentTweens.push(this.getTweenToCoordinate(point.x, point.y));
    });
  }

  getTweenToCoordinate (x, y) {
    var tween = this.game.add.tween(this.position);

    x = x * Parameters.world.tile.size;
    y = y * Parameters.world.tile.size;
    tween.to({ x:x, y:y }, this.moveDuration);

    return tween;
  }

  moveInPath (pathEndedCallback = () => {}) {
    if(this.currentTweens.length === 0){ return; }

    let index = 1;
    let direction;
    this.moving = true;

    let moveToNext = (tween) => {
      index ++;
      var nextTween = this.currentTweens[index];

      if(nextTween != null){
        tween.onComplete.add(() => {
          this.tweenInProgress = false;
          moveToNext(nextTween);
        });
      }
      else{
        // if i am the last tween
        tween.onComplete.add(() => {
          this.resetCurrentTweens();
          this.play('stop_' + direction, 0, false);
          pathEndedCallback();
        });
      }

      tween.start();
      direction = this.getTweenDirection(tween); 
      this.play('walk_' + direction, this.animDuration, true);

      this.tweenInProgress = true;
    }

    moveToNext(this.currentTweens[index]);
  }

  getTweenDirection (tween) {
    var isVerticalMovement = tween.properties.y == this.position.y;
    if(isVerticalMovement)
          return tween.properties.x > this.position.x ? 'right' : 'left';
    else  return tween.properties.y > this.position.y ? 'down' : 'up';
  }

  getTiles (isCoordinate = false) {
    return this.level.getTiles(this, isCoordinate);
  }
}
