var path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    crepestore: './main.js',
    example: './example.js'
  },
  output: {
    filename: '[name]-compiled.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
