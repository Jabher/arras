import 'babel-polyfill';
import Koa from 'koa';
import convert from 'koa-convert';
import sessionMiddleware from 'koa-session';
import bodyParserMiddleware from 'koa-bodyparser';
import staticMiddleware from 'koa-static';
import config from 'config';
import http from 'http';
import https from 'https';

import webpack from 'webpack';
import * as webpackConfig from '../webpack.config.babel';

import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';

const compiler = webpack(webpackConfig);

const app = new Koa();

if (config.env.dev)
    app.use(function invalidateRequireCache(ctx, next) {
        for (const key of Object.keys(require.cache))
            if (key.startsWith(`${config.paths.baseDir}`) && !key.startsWith(`${config.paths.baseDir}/node_modules`))
                Reflect.deleteProperty(require.cache, key);
        return next();
    });

if (config.env.dev)
    app.use(convert(webpackDevMiddleware(compiler, {
            noInfo: true,
            publicPath: webpackConfig.output.publicPath
        })))
        .use(convert(webpackHotMiddleware(compiler)));
else
    app.use(convert(staticMiddleware('static')));

app.use(require('./react-router-middleware').default);

app.use(convert(sessionMiddleware(app)));
app.use(convert(bodyParserMiddleware()));

app.use(require('./loader-middleware').default);

const {port, hostname, https: isHttps} = config.server;

const server = (isHttps ? https : http).createServer(app.callback());
server.listen({port, hostname}, () =>
    console.log(`app is listening on ${hostname || '0.0.0.0'}:${port}`));
