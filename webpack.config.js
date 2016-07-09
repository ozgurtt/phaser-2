var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var p2 = path.join(phaserModule, 'build/custom/p2.js');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});
var dev = process.argv.indexOf("--production") == -1;

module.exports = {
  node: {
    fs: 'empty'
  },
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/app.js')
    ],
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'easystar': path.join(__dirname, '/node_modules/easystarjs/src/easystar.js'),
      'easystar_phaser': path.join(__dirname, '/node_modules/phaser_plugin_pathfinding/bin/phaser_pathfinding-0.2.0.min.js')
    }
  },
  watch: dev,
  plugins: [
    definePlugin,
    new CopyWebpackPlugin([{ from: 'static', to: '' }])
  ].concat(dev ? [
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      open: false,
      server: {
        baseDir: ['./build']
      }
    })
  ]: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ]),
  module: {
    loaders: [
      { test: /\.(ico|jpe?g|png|gif)$/, loaders : ['img?minimize'] }, //'file?name=[path][name].[ext]'
      { test: /\.json$/, loader: 'json' },
      { test: /\.js$/, loader: 'babel', include: path.join(__dirname, 'src') },
      { test: /pixi\.js/, loader: 'expose?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
      { test: /p2\.js/, loader: 'expose?p2' },
      { test: /easystar\.js/, loader: 'expose?EasyStar' }
    ]
  },
  devtool: 'source-map',
  output: {
    pathinfo: dev,
    path: path.resolve(__dirname, 'build'),
    publicPath: './build/',
    filename: 'bundle.js'
  },
};
