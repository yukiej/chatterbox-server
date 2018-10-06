var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    './server/spec': path.resolve(__dirname, 'server/spec/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './server/spec/dist/')
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
  externals: {
  }
};
