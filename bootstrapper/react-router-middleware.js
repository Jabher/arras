import config from 'config';
import {match} from 'react-router';
import render from './util/react-router-middleware-html';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import {context, output, module, plugins} from '../webpack.config.babel'

const routesPath = `${config.paths.webappDir}/routes.js`;

const compiler = webpack({
    context, output, module, plugins, target: 'node',
    entry: {routes: `./${require('path').relative(context, routesPath)}`}
});
compiler.outputFileSystem = new MemoryFS();

const compilerLoad = new Promise(res => compiler.run((err) =>
    res(err ? null : eval(compiler.outputFileSystem.readFileSync('/routes.js').toString()).default)));

export default async function ReactRouterMiddleware(ctx, next) {
    const routes = await compilerLoad;

    if (!routes)
        await next();
    const [error, redirectLocation, renderProps] = await new Promise(res =>
        match({routes, location: ctx.req.url}, (...args) => res(args)));

    if (error)
        Object.assign(ctx, {status: 500, body: error.message});
    else if (redirectLocation)
        ctx.redirect(redirectLocation.pathname + redirectLocation.search);
    else if (renderProps)
        ctx.body = render(renderProps);
    else
        await next();
};
