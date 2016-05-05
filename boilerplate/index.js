global.Promise = require('bluebird');

var Arras = require('../');
var {env: {dev}, server} = require('config');
var webpackConfig = require('./webpack.config');
var path = require('path');

const loaders = [];
loaders.push(Arras.loaders.endpoints(path.resolve('./endpoints')));

new Arras({
    webpackConfig,
    dev,
    loaders
})
    .listen(server);