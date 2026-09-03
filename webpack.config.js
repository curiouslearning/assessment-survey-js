const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';
const buildPath = path.resolve(__dirname, 'build');
// Mirrors src/environment.ts's resolveBuildBasePath(environment) mapping — duplicated here
// (rather than imported) because this plain-JS config can't easily require() a TypeScript
// module. Same single input (nodeEnv), same trivial ternary, not a second signal that could
// drift out of sync. See specs/001-add-environment-constant/research.md §3a.
const buildBasePath = nodeEnv === 'test' ? '/assessment-survey-js' : '';
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
  // Webpack's own `mode` only ever accepts 'development' / 'production' / 'none' — it can't
  // represent the 3-way `test` environment directly, so it's derived here rather than passed
  // straight through. `test` behaves like a dev-like build (no minification); only the exported
  // `environment` constant (see src/environment.ts) tells `test` apart from `develop` at runtime.
  mode: nodeEnv === 'production' ? 'production' : 'development',
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
          // The `data-asset-base-url` attribute mechanism itself is unchanged — this only
          // rewrites the *value* baked into the copied build/index.html per build mode, so
          // test-mode builds resolve their own assets under the shared bucket's sub-path.
          // develop/production are a no-op rewrite back to the same "/assets" value.
          transform: {
            transformer(content) {
              return content
                .toString()
                .replace(/data-asset-base-url="[^"]*"/, `data-asset-base-url="${buildBasePath}/assets"`);
            },
          },
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
          to: 'assets/css',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'public', 'data'),
          to: 'assets/data',
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
  optimization: {
    // Webpack's automatic `process.env.NODE_ENV` bundle-time replacement defaults to inlining
    // `mode` (only ever 'development'/'production'), not the raw env var. Setting this explicitly
    // to the raw 3-way `nodeEnv` value ensures a `test` build inlines `"test"`, not `"development"`.
    nodeEnv,
  },
};
