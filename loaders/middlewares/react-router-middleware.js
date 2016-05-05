const {match} = require('react-router');
const renderer = require('../util/react-router-middleware-html');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const path = require('path');
const watcher = require('../util/webpack-watcher');
const ExternalsPlugin = require('webpack-externals-plugin');

//todo move to enhancers and make prod-mode

module.exports = function ({entry, output, context, module, plugins}) {
    const render = renderer({entry, output, context});
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
        entry: {routes: entry.routes}
    }), {outputFileSystem: fs});

    const watchdog = watcher(compiler);

    const readFile = () => fs.readFileSync(`/routes.js`).toString();

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
