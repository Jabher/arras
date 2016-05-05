const Koa = require('koa');
const isGeneratorFunction = require('is-generator-function');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const _http = require('http');
const _https = require('https');

class Ko extends Koa {
    use(fn) {
        return isGeneratorFunction(fn) ? super.use(Promise.coroutine(fn)) : super.use(fn);
    }
}


function validateWebpackConfig(webpackConfig) {
    const errors = [];

    (() => {
        if (!(webpackConfig instanceof Object))
            return errors.push('webpackConfig should be an object');
        if (!(webpackConfig.entry instanceof Object))
            return errors.push('webpackConfig.entry should be an object');
        if (!webpackConfig.entry.routes)
            errors.push('webpackConfig.entry.routes should be declared');
        if (typeof webpackConfig.entry.routes !== 'string')
            errors.push('webpackConfig.entry.routes should be a single module, not an array of modules');
        if (typeof webpackConfig.entry.storeCreator !== 'string')
            errors.push('webpackConfig.entry.storeCreator should be declared');
        if (!webpackConfig.entry.storeCreator)
            errors.push('webpackConfig.entry.storeCreator should be a single module, not an array of modules');
    })();

    return errors;
}

class Arras {
    servers = new Set();

    constructor({
        webpackConfig,
        dev = true,
        loaders = [],
        logger = bunyan.createLogger({name: 'Arras'})
    }) {
        validateWebpackConfig(webpackConfig);
        this.logger = logger;
        this.enhancers = [];

        const enhancerNames = [
            'baselevel',
            dev ? 'static-with-jit' : 'static-after-precompile',
            'react-isomorphic'
        ];

        for (const enhancerName of enhancerNames)
            try {
                this.logger.debug(`loading enhancer ${enhancerName}`);
                const Enhancer = require(`./enhancers/${enhancerName}.js`);
                const enhancer = new Enhancer(webpackConfig);
                this.enhancers.push(enhancer);
            } catch (e) {
                this.logger.error(e);
            }

        process.once('SIGINT', () => {
            this.logger.info('received SIGINT, stopping');
            this.unlisten();
        });
    }
}

Arras.prototype.listen = Promise.coroutine(function*({port = 3000, hostname, https = false} = {},
    serverFactory = (https ? _https : _http)) {
    const app = new Ko();

    for (const enhancer of this.enhancers)
        yield enhancer.beforeStart(app);

    const server = serverFactory.createServer(app.callback());
    server.app = app;

    yield new Promise(resolve => server.listen({port, hostname}, resolve));

    this.servers.add(server);
    
    this.logger.info(`server is listening on ${hostname}:${port}`);

    for (const enhancer of this.enhancers)
        yield enhancer.afterStart(app);

    return server;
});

Arras.prototype.unlisten = Promise.coroutine(function*(server) {
    const servers = server ? [server] : this.servers;

    for (const server of servers) {
        for (const enhancer of this.enhancers)
            yield enhancer.beforeEnd(server.app);

        yield new Promise(resolve => server.close(resolve));

        for (const enhancer of this.enhancers)
            yield enhancer.afterEnd(server.app);   
    }
});

module.exports = Arras;
module.exports.loaders = require('./loaders');

