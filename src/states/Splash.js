import Phaser from 'phaser';
import State from '../phaser/State';
import Text from '../phaser/Text';
import i18next from 'i18next';
import { Assets } from '../assets';

export default class extends State {
  preload () {
    this.textLoading = new Text(this.game, {x: this.game.world.centerX, y: this.game.world.centerY, text: i18next.t('Loading', {percent: 0})}, {
      fontSize: '42px', fill: "#000", align: "center"});
    this.textLoading.center();
    this.add.existing(this.textLoading);

    this.load.onFileComplete.add(this.progress, this);
    this.load.onLoadComplete.add(this.loaded, this);

    for (let groupKey in Assets.tilemap) {
      for(let assetKey in Assets.tilemap[groupKey]) {
        this.load.tilemap(`${groupKey}-${assetKey}`, Assets.tilemap[groupKey][assetKey], null, Phaser.Tilemap.TILED_JSON);
      }
    }

    for (let groupKey in Assets.sprites) {
      for(let assetKey in Assets.sprites[groupKey]) {
        this.load.atlas(`${groupKey}-${assetKey}`, Assets.sprites[groupKey][assetKey].image, Assets.sprites[groupKey][assetKey].json);
      }
    }

    for (let groupKey in Assets.image) {
      for(let assetKey in Assets.image[groupKey]) {
        this.load.image(`${groupKey}-${assetKey}`, Assets.image[groupKey][assetKey]);
      }
    }

    for (let groupKey in Assets.audio) {
      for(let assetKey in Assets.audio[groupKey]) {
        this.load.audio(`${groupKey}-${assetKey}`, Assets.audio[groupKey][assetKey]);
      }
    }

  }

  create () {

  }

  update () {

  }

  progress (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.textLoading.text = i18next.t('Loading', {percent: progress});
    
    console.log(`-- LOADING : File '${cacheKey}' Complete: ${progress}% - ${totalLoaded} / ${totalFiles} --`);
  }

  loaded () {
    this.state.start('Start');
  }
}
