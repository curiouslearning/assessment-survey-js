const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isDev = (env !== 'production');
const mode = isDev ? 'development' : 'production';

module.exports = {
  entry: './src/App.ts',
  mode,
  devtool: isDev ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
