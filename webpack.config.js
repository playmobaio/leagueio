const path = require('path');

module.exports = {
  entry: { 
    webpack_app: './src/client/js/app.ts',
    webpack_player: './src/client/js/cplayer.ts'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/client/js'),
  },
};