const fs = require('fs');
const URL = require('url');

const HTTPCodes = require('../util/http_codes');


module.exports = function (basePath) {
    return function* LoaderMiddleware(ctx, next) {
        if (ctx.res.headersSent)
            return;
        
        const {method} = ctx;
        const {pathname, query} = URL.parse(ctx.url, true);
        const [controllerName, rawId, ...args] = pathname.split('/').filter(a => a);
        const parsedId = parseInt(rawId);
        const id = Number.isNaN(parsedId) ? rawId : parsedId;

        const controllerPath = `${basePath}/${controllerName}.js`;

        if (!fs.existsSync(controllerPath))
            return yield next();

        const actionName = getActionName(method, id !== undefined);
        if (!actionName)
            return ctx.throw(HTTPCodes.BAD_REQUEST, 'illegal action');

        try {
            const actionFn = require(controllerPath)[actionName];
            if (!actionFn)
                return yield next();
            else
                ctx.body = yield actionFn({...query, ...ctx.request.body, id}, ...args);
        } catch (e) {
            if (e instanceof Error) {
                ctx.body = `${e.constructor.name}: ${e.message}`;
                ctx.status = HTTPCodes.INTERNAL_SERVER_ERROR;
            } else {
                ctx.body = e && e.message || e;
                ctx.status = e && e.status || HTTPCodes.BAD_REQUEST;
            }
        }

    }

};

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
