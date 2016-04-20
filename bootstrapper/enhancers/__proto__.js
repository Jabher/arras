export default class ProtoEnhancer {
    constructor(config, webpackConfig) { Object.assign(this, {config, webpackConfig}) }

    async beforeStart(app, server) {}
    async afterStart(app, server) {}
    async beforeEnd(app, server) {}
    async afterEnd(app, server) {}
}