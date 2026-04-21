const path = require('path');
const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';
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
  }
};
