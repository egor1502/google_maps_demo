var webpack           = require('webpack');
var webpackMerge      = require('webpack-merge');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var commonConfig      = require('./webpack.common.js');
var helpers           = require('./helpers');

var ENV = process.env.NODE_ENV = process.env.ENV = 'production';

var config = {};

config.devtool = 'source-map';

config.output = {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
};

config.plugins = [
    new CleanWebpackPlugin(helpers.root('dist'), {
        root: helpers.root('./'),
    }),
    new CopyWebpackPlugin([{from: helpers.root('./src/assets/'), to: helpers.root('./dist/assets')}]),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false
      }
    })
];

module.exports = webpackMerge(commonConfig, config);