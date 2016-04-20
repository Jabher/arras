import webpack from 'webpack';
import webpackDevMiddleware from '../middlewares/koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import convert from 'koa-convert';

import Proto from './__proto__';

export default class Bootstrap extends Proto {
    beforeStart(app) {
        this.compiler = webpack(this.webpackConfig);
        this.devMiddleware = webpackDevMiddleware(this.compiler, {
            noInfo: true,
            publicPath: this.webpackConfig.output.publicPath
        });
        
        const enhancer = this;

        app.use(function invalidateRequireCache(ctx, next) {
            for (const key of Object.keys(require.cache))
                if (key.startsWith(`${enhancer.config.paths.baseDir}`) && 
                    !key.startsWith(`${enhancer.config.paths.baseDir}/node_modules`))
                    Reflect.deleteProperty(require.cache, key);
            return next();
        });

        app.use(convert(this.devMiddleware));
        app.use(convert(webpackHotMiddleware(this.compiler)));
    }

    afterEnd() {
        this.devMiddleware.close();
    }
}