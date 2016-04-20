import 'babel-polyfill';
import Koa from 'koa';
import http from 'http';
import https from 'https';

import config from 'config';
import * as webpackConfig from '../webpack.config';

const enhancerNames = [
    'baselevel',
    'api',
    config.env.dev ? 'static-with-jit' : 'static-after-precompile',
    'react-isomorphic'
];

const enhancers = enhancerNames
    .map(filename => require(`./enhancers/${filename}.js`).default)
    .map(Enhancer => new Enhancer(config, webpackConfig));

(async function () {
    const app = new Koa();

    for (const enhancer of enhancers)
    try {
        await enhancer.beforeStart(app);
    } catch (e) {
        console.log(e);
        console.log(e.stack);
    }

    console.log('enhanced');
    
    const {port, hostname, https: isHttps} = config.server;
    const server = (isHttps ? https : http).createServer(app.callback());
    await new Promise(resolve => server.listen({port, hostname}, resolve));

    console.log(`server is listening on ${hostname}:${port}`);
    for (const enhancer of enhancers)
        await enhancer.afterStart(app);

    await new Promise(resolve => process.once('SIGINT', resolve));

    console.log('received SIGINT, stopping');
    
    for (const enhancer of enhancers)
        await enhancer.beforeEnd(app);

    await new Promise(resolve => server.close(resolve));

    for (const enhancer of enhancers)
        await enhancer.afterEnd(app);
})();
