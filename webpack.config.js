/**
 * © 2018 Justin Schlump
 * NakDev Webpack Config File
 */

//Update imports as needed per project 
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MinifyPlugin = require('babel-minify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//Update plugins as needed per project
const pluginsProd = [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new BundleAnalyzerPlugin(), new MiniCssExtractPlugin({
  filename: 'main.css'
}), new MinifyPlugin(), new OptimizeCSSAssetsPlugin(), new HtmlWebpackPlugin({
  template: 'src/index.html'
})];
const pluginsDev = [new HtmlWebpackPlugin({
  template: 'src/index.html'
}), new MiniCssExtractPlugin({
  filename: 'main.css'
}), new HardSourceWebpackPlugin()];

//Checking mode to apply correct settings
const isProd = process.env.NODE_ENV === 'production';
const toolProd = '';
const toolDev = 'eval';
const plugins = isProd ? pluginsProd : pluginsDev;
const devtool = isProd ? toolProd : toolDev;

module.exports = {
  devtool: devtool,
  entry: ['babel-polyfill', './src/js/Main.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: plugins,
  module: {
    rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(jpg|png)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img/',
            publicPath: 'img/'
          }
        }],
      }
    ]
  },
};