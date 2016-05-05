import convert from 'koa-convert';
import staticMiddleware from 'koa-static';
import webpack from 'webpack';
import Proto from './../../loaders/__proto__';

const tempDir = `${__dirname}/.temp`;
export default class Bootstrap extends Proto {
    async beforeStart(app) {
        const config = {...this.webpackConfig};
        config.output = {...config.output, path: tempDir};
        await new Promise(resolve => webpack(config)
            .run((err, stats) => err ? Promise.reject(err) : Promise.resolve()));
        app.use(convert(staticMiddleware(config.output.path)));   
    }
}
