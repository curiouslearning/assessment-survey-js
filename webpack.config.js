const path = require('path');
const { container: { ModuleFederationPlugin } } = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const { InjectManifest } = require('workbox-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/mf-entry.ts',
  mode: isDev ? 'development' : 'production',
  devtool: 'inline-source-map',
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
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 8080,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'assessment_survey_js',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/mf-entry'
      },
      shared: {},
    }),
    new CopyPlugin({
      patterns: [
        { from: "./css", to: "./css" },
        { from: "./img", to: "./img" },
        { from: "./audio", to: "./audio" },
        { from: "./data", to: "./data" },
        { from: "./animation", to: "./animation" },
      ],
    }),
    // Only inject service worker in production
    ...(isDev ? [] : [
      new InjectManifest({
        swSrc: "./sw-src.js",
        swDest: "sw.js",
        exclude: [/audio\//, /data\//],
      }),
    ]),
  ],
};
