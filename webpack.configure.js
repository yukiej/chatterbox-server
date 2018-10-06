const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',

  entry: {
    'spec': path.resolve(__dirname, 'server/spec/index.js')
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './server/spec/dist/')
  },

  externals: {
    fs: require('fs'),
    path: require('path'),
  },

  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'stage-0']
        }
      }
    ]
  },


};
