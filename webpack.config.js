var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve('./src/index.js'),
  output: {
    path: path.resolve('./dist'),
    filename: 'stashed.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            "plugins": [["transform-react-jsx", { "pragma": "h" }]],
            presets: ['env'],
          },
        },
      },
    ],
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()],
};
