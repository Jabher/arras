import convert from 'koa-convert';
import sessionMiddleware from 'koa-session';
import bodyParserMiddleware from 'koa-bodyparser';
import Proto from './__proto__';


export default class BaseLevel extends Proto {
    async beforeStart(app) {
        app.use(convert(sessionMiddleware(app)));
        app.use(convert(bodyParserMiddleware()));
    }
}
