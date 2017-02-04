const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {

    // Check if it is for prod build
    const isProd = env === 'prod';

    // Default config values for development
    let entryMain = [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './index.js'
    ];

    let outputFolder = 'dist';

    let plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'src/index.html'), // eslint-disable-line no-undef
            filename: 'index.html',
            inject: 'body'
        })
    ];

    let outputFileName = 'bundle';

    let sassLoader = ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'];

    // Change config values if it is for prod
    if (isProd) {
        entryMain = [
            './index.js',
            './sass/index.scss'
        ];
        outputFolder = 'build';
        outputFileName = '[chunkhash].[name]';
        sassLoader = ExtractTextPlugin.extract(['css-loader', 'sass-loader']);
        plugins = [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true
                },
                comments: false
            }),
            new ExtractTextPlugin({
                filename: '[chunkhash].[name].css',
                allChunks: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: '[chunkhash].[name].js',
                minChunks: function (module) {
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            new HtmlWebpackPlugin({
                template: resolve(__dirname, 'src/index.html'), // eslint-disable-line no-undef
                filename: 'index.html',
                inject: 'body'
            })
        ];
    }

    // Build configuration object and return
    return {
        entry: {
            main: entryMain
        },
        output: {
            filename: outputFileName + '.js',
            path: resolve(__dirname, outputFolder), // eslint-disable-line no-undef
            publicPath: '/',
            sourceMapFilename: outputFileName + '.map'
        },
        context: resolve(__dirname, 'src'), // eslint-disable-line no-undef
        devtool: !isProd ? 'inline-source-map' : false,
        devServer: !isProd ? {
            hot: true,
            contentBase: resolve(__dirname, outputFolder), // eslint-disable-line no-undef
            publicPath: '/',
            historyApiFallback: true
        } : {},
        module: {
            rules: [
                { // js loader
                    test: /\.js$/,
                    use: [
                        'babel-loader',
                    ],
                    exclude: /node_modules/
                },
                { // sass / scss loader for webpack
                    test: /\.(sass|scss)$/,
                    loaders: sassLoader
                }
            ],
        },
        plugins
    };
};