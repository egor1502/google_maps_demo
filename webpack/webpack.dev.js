var webpackMerge      = require('webpack-merge');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var commonConfig      = require('./webpack.common');
var helpers           = require('./helpers');

var config = {};

config.devtool = 'cheap-module-eval-source-map';

config.output = {
    path: helpers.root('app'),
    publicPath: 'http://localhost:4000/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
};

config.plugins = [
    new ExtractTextPlugin('[name].css')
];

config.devServer = {
    contentBase: helpers.root('src'),
    historyApiFallback: true,
    stats: 'minimal',
    port: 4000
};

module.exports = webpackMerge(commonConfig, config);