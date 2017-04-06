var path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: './crepestore.js',
  output: {
    filename: 'crepestore-compiled.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
