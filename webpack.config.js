const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const isDev = (env !== 'production');
const mode = isDev ? 'development' : 'production';

module.exports = {
  entry: './src/App.ts',
  mode,
  devtool: isDev ? 'inline-source-map' : false,
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'public'), 
          to: path.resolve(__dirname, 'dist') 
        },
      ],
    }),
  ],
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
