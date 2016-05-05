const {env} = require('config');
const {
    DefinePlugin,
    HotModuleReplacementPlugin,
    NoErrorsPlugin,
    optimize
} = require('webpack');

const DEV = env.dev;

const basePlugins = () => [
    new DefinePlugin({
        'process.env.NODE_ENV': DEV ? '"development"' : '"production"',
        __DEV__: String(DEV)
    })
];

const devPlugins = () => [
    new optimize.OccurrenceOrderPlugin(),
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin()
];

const prodPlugins = () => [
    new (require('extract-text-webpack-plugin'))('style.css'),
    new optimize.UglifyJsPlugin(),
    new optimize.DedupePlugin(),
    new optimize.AggressiveMergingPlugin()
];

module.exports = DEV ? [...basePlugins(), ...devPlugins()] : [...basePlugins(), ...prodPlugins()];