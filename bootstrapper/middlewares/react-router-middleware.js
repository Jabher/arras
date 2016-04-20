import {match} from 'react-router';
import renderer from './../util/react-router-middleware-html';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import path from 'path';
import watcher from './../util/webpack-watcher';
import ExternalsPlugin from 'webpack-externals-plugin'

//todo move to enhancers and make prod-mode

const virtualFilename = 'routes';

export default function (config, {entry, output, context, module, plugins}) {
    const render = renderer(config, {entry, output});
    const routesPath = `${config.paths.webappDir}/routes.js`;
    const fs = new MemoryFS();

    const compiler = Object.assign(webpack({
        context, output, module,
        plugins: [...plugins, new ExternalsPlugin({
            type: 'commonjs',
            include: path.resolve(__dirname, '../../node_modules'),
            exclude: path.resolve(__dirname, '../../node_modules/webpack')
        })],
        target: 'node',
        entry: {[virtualFilename]: `./${path.relative(context, routesPath)}`}
    }), {outputFileSystem: fs});

    const watchdog = watcher(compiler);

    const readFile = () => fs.readFileSync(`/${virtualFilename}.js`).toString();

    const generateCompiledModule =
        () => compiledModule || eval(readFile()).default;

    let compiledModule = null;

    watchdog.on('built', () => compiledModule = generateCompiledModule());
    watchdog.on('reset', () => compiledModule = null);

    async function ReactRouterMiddleware(ctx, next) {
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
    }

    ReactRouterMiddleware.close = ::watchdog.close;

    return ReactRouterMiddleware;
}
