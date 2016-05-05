class ProtoEnhancer {
    constructor(webpackConfig) { Object.assign(this, {webpackConfig}) }

    beforeStart(app, server) {}
    afterStart(app, server) {}
    beforeEnd(app, server) {}
    afterEnd(app, server) {}
}

module.exports = ProtoEnhancer;