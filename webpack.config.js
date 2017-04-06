var path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    crepestore: './main.js'
  },
  output: {
    filename: '[name]-compiled.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
