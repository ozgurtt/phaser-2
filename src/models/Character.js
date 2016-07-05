import Sprite from '../phaser/Sprite'
import { Parameters } from '../config'

export default class extends Sprite {

  constructor (game, level, {x, y, asset, isCollisionEnabled = true}) {
    super(game, {x, y, asset});
    this.level = level;

    this.moveDuration = 400;

    this.currentTweens = [];
    this.moving = false;
    this.tweenInProgress = false;

    if(isCollisionEnabled){
      this.game.physics.enable(this);
      this.body.fixedRotation = true;
    }
  }

  setupAnimations (animations) {
    for (var key in animations) {
      this.animations.add(key, animations[key]);
    }
  }

  setMoveDuration (moveDuration) {
    this.moveDuration = moveDuration;
  }

  play(key, duration, isLoop){
    this.animations.play(key, duration, isLoop);
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

    x = (x * Parameters.world.tile.size);
    y = (y * Parameters.world.tile.size);
    tween.to({ x:x, y:y }, this.moveDuration);

    return tween;
  }

  moveInPath (pathEndedCallback = () => {}) {
    if(this.currentTweens.length === 0){ return; }
    var index = 1;
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
          pathEndedCallback();
        });
      }

      tween.start();
      this.faceNextTile(tween);

      this.tweenInProgress = true;
    }

    moveToNext(this.currentTweens[index]);
  }

  faceNextTile (tween) {
    var isVerticalMovement = tween.properties.y == this.position.y;

    if(isVerticalMovement) {
      if(tween.properties.x & this.position.x){
        //this.sprite.walkRight();
      }
      else {
        //this.sprite.walkLeft();
      }
    }
    else {
      if(tween.properties.y & this.position.y){
        //this.sprite.walkDown();
      }
      else {
        //this.sprite.walkUp();
      }
    }
  }
}
