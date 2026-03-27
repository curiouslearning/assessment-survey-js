const path = require('path');
const webpack = require('webpack');
require('dotenv').config();
const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';

module.exports = {
  mode: nodeEnv,
  entry: './src/standalone.ts',
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
      },
       {
        directory: path.join(__dirname), // serve sw.js from root
        publicPath: '/',
      },
  ],
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
    alias: {
      '@analytics': path.resolve(__dirname, 'src/analytics/'),
      '@assessment': path.resolve(__dirname, 'src/assessment/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@configs': path.resolve(__dirname, 'src/config/'),
      '@survey': path.resolve(__dirname, 'src/survey/'),
      '@ui': path.resolve(__dirname, 'src/ui/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),

    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
      'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID),
    })
  ],
};
