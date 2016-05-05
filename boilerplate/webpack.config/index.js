const {env, paths} = require('config');
const DEV = env.dev;

module.exports.plugins = require('./webpack.plugins.js');

module.exports.postcss = require('./webpack.postcss.js');

module.exports.context = paths.baseDir;

module.exports.entry = {
    vendor: ['babel-polyfill', 'whatwg-fetch'].concat(DEV ? ['webpack-hot-middleware/client'] : []),
    routes: './webapp/routes',
    storeCreator: './webapp/storeCreator'
};

module.exports.output = {
    path: '/',
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].[name].js'
};

module.exports.devtool = 'source-map';

module.exports.module = {
    loaders: require('./webpack.loaders.js')
};

module.exports.cache = DEV;
module.exports.debug = DEV;