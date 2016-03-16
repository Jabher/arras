import 'babel-polyfill';
import Koa from 'koa';
import convert from 'koa-convert';
import sessionMiddleware from 'koa-session';
import bodyParserMiddleware from 'koa-bodyparser';
import staticMiddleware from 'koa-static';
import HTTPCodes from './http_codes';

import fs from 'fs';
import path from 'path';
import URL from 'url';

function getActionName(action, hasId) {
    switch (action) {
        case 'GET':
            return hasId ? 'read' : 'search';
        case 'POST':
            return hasId ? undefined : 'create';
        case 'PUT':
            return hasId ? 'update' : undefined;
        case 'DELETE':
            return hasId ? 'destroy' : undefined;
    }
}

const app = new Koa();
app.use(convert(staticMiddleware('static')));
app.use(convert(sessionMiddleware(app)));
app.use(convert(bodyParserMiddleware()));
app.use(function(ctx, next) {
    const {method} = ctx;
    const {pathname, query} = URL.parse(ctx.url, true);
    const [controllerName, rawId, ...args] = pathname.split('/').filter(a => a);
    const parsedId = parseInt(rawId);
    const id = Number.isNaN(parsedId) ? rawId : parsedId;

    const controllerPath = path.resolve(`${__dirname}/api/${controllerName}.js`);
    if (!fs.existsSync(controllerPath))
        return next();

    const actionName = getActionName(method, id !== undefined);
    if (!actionName)
        return ctx.throw(HTTPCodes.BAD_REQUEST, 'illegal action');

    for (const key of Object.keys(require.cache))
        if (key.startsWith(`${__dirname}/api`) || key.startsWith(`${__dirname}/models`))
            Reflect.deleteProperty(require.cache, key);


    const actionFn = require(controllerPath)[actionName];
    if (!actionFn)
        return next();

    return Promise.resolve()
        .then(() => actionFn({...query, id, args}))
        .then(
            body => Object.assign(ctx, {body}),
            e =>
                Object.assign(ctx, e instanceof Error
                    ? {body: `${e.constructor.name}: ${e.message}`, status: HTTPCodes.INTERNAL_SERVER_ERROR}
                    : {body: e && e.message || e, status: e && e.status || HTTPCodes.BAD_REQUEST}))
        .then(next);
});

app.listen(8088);