const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

// @curiouslearning/sw's single bundled entry point pulls in workbox-routing
// and workbox-precaching alongside the createInjectManifestOptions() helper
// we actually need here. Those workbox packages assume a service-worker
// global scope and touch `self` at module-evaluation time (workbox-core's
// logger), which throws under plain Node when this config is loaded. Only
// createInjectManifestOptions() (a pure config-object builder) is used at
// build time, so a minimal `self` shim is enough to satisfy that top-level
// reference without affecting the actual browser/service-worker bundle.
if (typeof self === 'undefined') {
  global.self = global;
}
const { createInjectManifestOptions } = require('@curiouslearning/sw');
const { normalizeBasePath, applyBasePath } = require('./build-config/base-path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';
const basePath = normalizeBasePath(process.env.BASE_PATH);
const injectBasePath = (content) => applyBasePath(content.toString(), basePath);
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
          transform: injectBasePath,
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
          transform: injectBasePath,
        }
      ],
    }),
    (() => {
      // createInjectManifestOptions() (per §4.3/README) returns
      // { swSrc, swDest, globDirectory, maximumFileSizeToCacheInBytes, ...overrides }.
      // globDirectory/globPatterns/globIgnores are options for workbox-build's
      // filesystem-globbing injectManifest() (used by workbox-cli). They are NOT
      // accepted by workbox-webpack-plugin's InjectManifest — its options schema
      // (WebpackInjectManifestOptions, additionalProperties: false) rejects
      // `globDirectory` outright ("property is not expected to be here"), verified
      // against the actually-installed workbox-webpack-plugin@7.4.1 /
      // workbox-build@7.4.1. The webpack flavor precaches whatever webpack itself
      // emits/copies (bundle.js + CopyWebpackPlugin's assets), filtered via
      // `exclude`/`include`/`chunks` instead of glob directory scanning. We still
      // consume createInjectManifestOptions() for its swSrc/swDest/
      // maximumFileSizeToCacheInBytes conventions, but strip the glob-only keys
      // before handing the result to InjectManifest.
      const { globDirectory, globPatterns, globIgnores, ...injectManifestOptions } =
        createInjectManifestOptions({
          swSrc: path.resolve(__dirname, 'src', 'sw-src.ts'),
          swDest: 'sw.js', // relative to output.path (buildPath), matching current build/sw.js
        });

      return new InjectManifest({
        ...injectManifestOptions,
        // Re-expresses the old globIgnores audio exclusion (assets/audio/*/*.mp3|wav)
        // as a webpack `exclude` condition, plus workbox's own defaults
        // ([/\.map$/, /^manifest.*\.js$/]), which are replaced (not merged) once
        // `exclude` is explicitly provided.
        exclude: [/\.map$/, /^manifest.*\.js$/, /assets\/audio\/.*\.(mp3|wav)$/i],
        // maximumFileSizeToCacheInBytes: inherited from the package default (10 MiB) —
        // identical to today's explicit value, no override needed.
      });
    })(),
  ],
  output: {
    clean: true,
    filename: 'bundle.js',
    path: buildPath,
  },
  // Dev-only noise suppression. In `webpack serve`/watch mode a single
  // InjectManifest instance stays alive across every recompilation (HMR
  // rebuilds, file saves) and unconditionally warns from the 2nd call on —
  // see https://github.com/GoogleChrome/workbox/issues/1790. Each rebuild
  // still regenerates the precache manifest from that build's own assets, so
  // it's expected dev-server noise, not a real problem. Only filter it in
  // dev; a production `build` compiles once and must never hide warnings.
  ...(isDev
    ? {
        ignoreWarnings: [{ message: /InjectManifest has been called multiple times/ }],
      }
    : {}),
};
