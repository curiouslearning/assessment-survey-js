const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';

module.exports = {
  mode: nodeEnv,
  entry: './src/standalone.ts',
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    client: {
      overlay: true,
    },
    compress: false,
    port: 8081,
    hot: true,
  },
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
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname),
  },
};