const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry:{
      flappy: ['./source/js/client/flappy.jsx.js'],
   },
   plugins: [
      new CleanWebpackPlugin(['./public/1/js'])
   ],
   output: {
      path: __dirname + '/public/1/js',
      filename: '[name].js',
      libraryTarget: 'var',
      library: 'packed',
   },
   module: {
      rules: [{
         test: /\.js$/,
         exclude: /node_modules/,
         use: {
            loader: 'babel-loader',
            options: {
               presets: ['@babel/preset-env']
            }
         },
      }]
   }
   //externals: [nodeExternals()],
};