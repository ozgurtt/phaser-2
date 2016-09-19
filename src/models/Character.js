import Phaser from 'phaser';
import Sprite from '../phaser/Sprite';
import { Parameters } from '../configuration/parameters'

export default class extends Sprite {
  constructor (game, level, {x, y, asset, isCollisionEnabled = true, speed = 60}) {
    super(game, {x: x * level.tilesize, y: y * level.tilesize, asset});
    this.game = game;
    this.level = level;
    this.level.add(this);

    this.setSpeed(speed);

    this.currentTweens = [];
    this.currentTween = null;
    this.currentIndex = 1,
    this.moving = false;
    this.tweenInProgress = false;

    if(isCollisionEnabled){
      this.game.physics.enable(this);
      this.body.fixedRotation = true;
    }
  }

  initCollisions () {
    this.body.collideWorldBounds = true;
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
    this.moveSpeed = speed; // 60
    this.moveDuration = 300 * 100 / speed; // 500
    this.animDuration = speed / 5; // 12
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

    x = x * this.level.tilesize;
    y = y * this.level.tilesize;
    tween.to({ x:x, y:y }, this.moveDuration);

    return tween;
  }

  moveInPath (pathEndedCallback = () => {}) {
    if(this.currentTweens.length === 0){ return; }

    this.currentIndex = 1;
    let direction;
    this.moving = true;

    let moveToNext = (tween) => {
      this.currentIndex ++;
      this.currentTween = tween;

      var nextTween = this.currentTweens[this.currentIndex];

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

    moveToNext(this.currentTweens[this.currentIndex]);
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
