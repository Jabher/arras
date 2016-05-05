import loaderMiddleware from '../../loaders/middlewares/loader-middleware';

import Proto from './../../loaders/__proto__';


export default class BaseLevel extends Proto {
    async beforeStart(app) {
        app.use(loaderMiddleware(this.config));
    }
}
