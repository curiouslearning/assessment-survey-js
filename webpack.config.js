const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';
const buildPath = path.resolve(__dirname, 'build');
const curiousLearningPackagesPath = path.resolve(__dirname, 'node_modules', '@curiouslearning');
const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        modules: false,
        targets: {
          android: '5',
          chrome: '49',
          ios: '10',
          safari: '10',
        },
      },
    ],
  ],
};

module.exports = {
  mode: nodeEnv,
  entry: './src/standalone.ts',
  target: ['web', 'es5'],
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    static: {
      directory: buildPath,
    },
    client: {
      overlay: true,
    },
    compress: false,
    devMiddleware: {
      writeToDisk: true,
    },
    port: 8081,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        include: [curiousLearningPackagesPath],
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
      },
    ],
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json', // default, can omit
      }),
    ],
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'index.html'),
          to: 'index.html',
        },
        {
          from: path.resolve(__dirname, 'favicon.ico'),
          to: 'favicon.ico',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'public', 'assets'),
          to: 'assets',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'public', 'css'),
          to: 'css',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'public', 'data'),
          to: 'data',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'public', 'manifest.json'),
          to: 'manifest.json',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  output: {
    clean: true,
    filename: 'bundle.js',
    path: buildPath,
  },
};
