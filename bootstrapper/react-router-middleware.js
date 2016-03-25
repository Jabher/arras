import config from 'config';
import {match} from 'react-router';
import render from './util/react-router-middleware-html';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import {context, output, module, plugins} from '../webpack.config.babel'

import watcher from './util/webpack-watcher';


const routesPath = `${config.paths.webappDir}/routes.js`;
const compiler = webpack({
    context, output, module, plugins, target: 'node',
    entry: {routes: `./${require('path').relative(context, routesPath)}`}
});
compiler.outputFileSystem = new MemoryFS();
const watchdog = watcher(compiler);

const generateCompiledModule = () => compiledModule ||
eval(compiler.outputFileSystem.readFileSync('/routes.js').toString()).default;

let compiledModule = null;

watchdog.on('built', () => compiledModule = generateCompiledModule());
watchdog.on('reset', () => compiledModule = null);

export default async function ReactRouterMiddleware(ctx, next) {
    if (!compiledModule)
        await new Promise(res => watchdog.once('built', res));
    compiledModule = generateCompiledModule();
    const routes = compiledModule;

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
