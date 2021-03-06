var path = require('path');

module.exports = function() {
  return {
    context: path.resolve(__dirname, './../src'),
    entry: {
      crepestore: './main.js',
      example: './example.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './../dist')
    },
    devtool: 'source-map',
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    }
  };
}
