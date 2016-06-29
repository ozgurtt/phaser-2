import Phaser from 'phaser'
import State from '../phaser/State'
import { Assets } from '../config'

export default class extends State {
  preload () {
    this.load.onFileComplete.add(this.progress, this);
    this.load.onLoadComplete.add(this.loaded, this);

    for (let groupKey in Assets.tilemap) {
      for(let assetKey in Assets.tilemap[groupKey]) {
        this.load.tilemap(`${groupKey}-${assetKey}`, Assets.tilemap[groupKey][assetKey], null, Phaser.Tilemap.TILED_JSON)
      }
    }

    for (let groupKey in Assets.sprites) {
      for(let assetKey in Assets.sprites[groupKey]) {
        this.load.atlas(`${groupKey}-${assetKey}`, Assets.sprites[groupKey][assetKey].image, Assets.sprites[groupKey][assetKey].json);
      }
    }

    for (let groupKey in Assets.image) {
      for(let assetKey in Assets.image[groupKey]) {
        this.load.image(`${groupKey}-${assetKey}`, Assets.image[groupKey][assetKey])
      }
    }

    for (let groupKey in Assets.audio) {
      for(let assetKey in Assets.audio[groupKey]) {
        this.load.audio(`${groupKey}-${assetKey}`, Assets.audio[groupKey][assetKey])
      }
    }

  }

  progress (progress, cacheKey, success, totalLoaded, totalFiles) {
    console.log(`-- LOADING : File '${cacheKey}' Complete: ${progress}% - ${totalLoaded} / ${totalFiles} --`)
  }

  loaded () {
    this.state.start('Game')
  }
}
