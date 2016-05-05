import 'babel-polyfill';
import Koa from 'koa';
import http from 'http';
import https from 'https';
import EnhancerProto from '../loaders/__proto__';


const enhancerNames = [
    'baselevel',
    'api',
    config.env.dev ? 'static-with-jit' : 'static-after-precompile',
    'react-isomorphic'
];

export default class Arras {
    constructor({
        config = require('config'),
        logger = require('bunyan'),
        webpackConfig = {},
        loaders = [],
        app = new Koa()
    }) {
        if (!webpackConfig.entry) {
            this.logger.error('webpackConfig.entry should be provided');
            throw new TypeError('webpackConfig.entry should be provided');
        }
        if (!webpackConfig.routes || !webpackConfig.storeCreator) {
            this.logger.error('webpackConfig.entry.routes and webpackConfig.entry.storeCreator should be provided');
            throw new TypeError('webpackConfig.entry.routes and webpackConfig.entry.storeCreator should be provided');
        }

        const enhancers = [];
        for (const enhancerName of enhancerNames)
            try {
                this.logger.debug(`loading enhancer ${enhancerName}`);
                const Enhancer = require(`./enhancers/${enhancerName}.js`).default;
                const enhancer = new Enhancer(this.config, this.webpackConfig);
                enhancers.push(enhancer);
            } catch (e) {
                this.logger.error(e);
            }

        Object.assign(this, {
            config,
            logger,
            webpackConfig,
            app,
            enhancers: enhancers.concat(loaders.map(loader => loader instanceof EnhancerProto
                ? loader
                : class extends EnhancerProto { async beforeStart(app) { app.use(loader(this.config)); } }))
        })
    }

    async load() {
        for (const enhancer of this.enhancers)
            await enhancer.beforeStart(this.app);

        const {port, hostname, https: isHttps} = this.config.server || {};
        const server = (isHttps ? https : http).createServer(this.app.callback());
        await new Promise(resolve => server.listen({port, hostname}, resolve));

        this.logger.info(`server is listening on ${hostname}:${port}`);
        for (const enhancer of this.enhancers)
            await enhancer.afterStart(this.app);

        process.once('SIGINT', () => {
            this.logger.info('received SIGINT, stopping');
            this.unload();
        });
    }

    async unload() {
        for (const enhancer of this.enhancers)
            await enhancer.beforeEnd(this.app);

        await new Promise(resolve => server.close(resolve));

        for (const enhancer of this.enhancers)
            await enhancer.afterEnd(this.app);
    }
}