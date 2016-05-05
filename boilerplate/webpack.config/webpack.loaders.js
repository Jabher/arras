var {env} = require('config');

const DEV = env.dev;

const appLogicLoader = {
    test: /\.jsx?$/,
    exclude: [/node_modules/, /workers/, /3rd-party/],
    loaders: DEV ? ['react-hot', 'babel'] : ['babel']
};

const thirdPartyStyleLoader = {
    test: /\.css$/,
    include: [/3rd-party/, /node_modules/],
    loader: DEV ?
        `style!css?-loader&-url` :
        require("extract-text-webpack-plugin").extract('style', 'css?-loader&-url')
};

const commonStyleLoader = {
    test: /\.css$/,
    exclude: [/3rd-party/, /node_modules/],
    loader: DEV
        ? `style!css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss`
        : require("extract-text-webpack-plugin")
        .extract('style', `css?modules&localIdentName=[hash:base64:5]!postcss`)
};

const JSONLoader = {test: /\.json$/, loader: 'json'};

const HTMLLoader = {test: /\.html$/, exclude: /node_modules/, loaders: ['html']};

const JadeHTMLLoader = {test: /\.html\.jade$/, loaders: ['html', 'jade-html']};
const JadeLoader = {test: /\.jade$/, exclude: [/\.html\.jade$/], loaders: ['jade']};

module.exports = [
    appLogicLoader,
    thirdPartyStyleLoader,
    commonStyleLoader,
    JSONLoader,
    HTMLLoader,
    JadeLoader,
    JadeHTMLLoader
];