import loaderMiddleware from './middlewares/loader-middleware';

import Proto from './__proto__';


class API extends Proto {
    beforeStart(app) {
        app.use(convert(sessionMiddleware(app)));
        app.use(convert(bodyParserMiddleware()));
        app.use(loaderMiddleware(this.webpackConfig));
    }
}