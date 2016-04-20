import loaderMiddleware from '../middlewares/loader-middleware';

import Proto from './__proto__';


export default class BaseLevel extends Proto {
    async beforeStart(app) {
        app.use(loaderMiddleware(this.config));
    }
}
