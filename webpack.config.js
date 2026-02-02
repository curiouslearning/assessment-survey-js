const path = require('path');
const { container: { ModuleFederationPlugin } } = require('webpack');

module.exports = {
  entry: './src/App.ts',
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
    port: 8000,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
  },
   plugins: [
    // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
    new ModuleFederationPlugin({
      name: 'assessment_survey_js',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'assessment_survey_js' },
      exposes: {
        './App': './src/App',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
};
