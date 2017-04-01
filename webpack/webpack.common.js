var webpack           = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var helpers           = require('./helpers');

var config = {};

config.entry = {
    app: './src/app.js'
};

config.resolve = {
    extensions: ['.js']
};

config.module = {
    rules: [
        {
            test: /\.js$/,
            use: ['ng-annotate-loader', 'babel-loader']
        },
        {
            test: /\.html$/,
            use: 'html-loader'
        },
        {
            test: /\.(png|jpe?g|gif|svg|ico)$/,
            use: 'file-loader?name=assets/images/[name].[ext]'
        },
        {
            test: /\.(|woff|woff2|ttf|eot)$/,
            use: 'file-loader?name=assets/fonts/[name].[ext]'
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader?sourceMap'
            })
        },
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader?sourceMap!sass-loader'
            })
        }
    ]
};

config.plugins = [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app']
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
];

module.exports = config;