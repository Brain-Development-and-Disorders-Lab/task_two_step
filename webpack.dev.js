/**
 * Webpack configuration for automated testing
 *
 * Builds tests/automated/index.ts into a self-contained bundle, uses the real
 * ChoicePlugin but mocks Neurocog extension
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './tests/automated/index.ts',
  output: {
    path: path.resolve(__dirname, 'tests/automated/dist'),
    filename: 'test-bundle.js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './tests/automated/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'tests/automated/dist'),
    },
    port: 9999,
    hot: false,
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  devtool: 'inline-source-map',
};
