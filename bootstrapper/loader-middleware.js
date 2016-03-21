import fs from 'fs';
import path from 'path';
import URL from 'url';

import HTTPCodes from './http_codes';

const baseDir = process.cwd();

export default function(ctx, next) {
    const {method} = ctx;
    const {pathname, query} = URL.parse(ctx.url, true);
    const [controllerName, rawId, ...args] = pathname.split('/').filter(a => a);
    const parsedId = parseInt(rawId);
    const id = Number.isNaN(parsedId) ? rawId : parsedId;

    const controllerPath = path.resolve(`${baseDir}/api/${controllerName}.js`);
    if (!fs.existsSync(controllerPath))
        return next();

    const actionName = getActionName(method, id !== undefined);
    if (!actionName)
        return ctx.throw(HTTPCodes.BAD_REQUEST, 'illegal action');

    for (const key of Object.keys(require.cache))
        if (key.startsWith(`${baseDir}/api`) || key.startsWith(`${baseDir}/models`))
            Reflect.deleteProperty(require.cache, key);


    const actionFn = require(controllerPath)[actionName];
    if (!actionFn)
        return next();

    const props = {...query, ...ctx.request.body, id};

    return Promise.resolve()
        .then(() => args.length ? actionFn(props, ...args) : actionFn(props))
        .then(
            body => Object.assign(ctx, body && body.status ? body : {body}),
            e =>
                Object.assign(ctx, e instanceof Error
                    ? {body: `${e.constructor.name}: ${e.message}`, status: HTTPCodes.INTERNAL_SERVER_ERROR}
                    : {body: e && e.message || e, status: e && e.status || HTTPCodes.BAD_REQUEST}))
}


function getActionName(action, hasId) {
    switch (action) {
        case 'GET':
            return hasId ? 'read' : 'search';
        case 'POST':
            return hasId ? undefined : 'create';
        case 'PUT':
            return hasId ? 'update' : undefined;
        case 'DELETE':
            return hasId ? 'destroy' : 'destroyAll';
    }
}
