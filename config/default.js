import path from 'path';

export const env = {
    dev: true
};
export const server = {
    port: 8088
};

export const db = {
    path: 'http://neo4j:password@localhost:7474'    
};

export const webpack = {
    context: path.resolve(__dirname, '..'),
    entry: {
        vendor: ['babel-polyfill', 'whatwg-fetch'],
        webapp: ['./webapp/index.js'],
        hotreload: env.dev ? ['webpack-hot-middleware/client'] : []
    },
    output: {
        path: path.resolve(__dirname, '../static'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].[name].js'
    },
    devtool: 'source-map'
};