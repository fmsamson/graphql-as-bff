const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'build'),
    libraryTarget: 'commonjs2',
  },
};