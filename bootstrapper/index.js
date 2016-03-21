import 'babel-polyfill';
import Koa from 'koa';
import convert from 'koa-convert';
import sessionMiddleware from 'koa-session';
import bodyParserMiddleware from 'koa-bodyparser';
import staticMiddleware from 'koa-static';
import config from 'config';

import webpack from 'webpack';
import webpackConfig from '../webpack.config.babel';

import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';

const compiler = webpack(webpackConfig);

import loader from './loader-middleware';

const app = new Koa();

if (config.env.dev)
    app.use(convert(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    })))
        .use(convert(webpackHotMiddleware(compiler)));
else
    app.use(convert(staticMiddleware('static')));
app.use(convert(sessionMiddleware(app)));
app.use(convert(bodyParserMiddleware()));
app.use(loader);

app.listen(config.server.port);