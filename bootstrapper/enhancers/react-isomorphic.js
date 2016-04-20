import routerMiddleware from '../middlewares/react-router-middleware';

import Proto from './__proto__';


export default class BaseLevel extends Proto {
    async beforeStart(app) {
        app.use(this.loader = routerMiddleware(this.config, this.webpackConfig));
    }
    async afterEnd() {
        this.loader.close();
    }
}
