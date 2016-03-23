import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';

import routes from '../webapp/routes';
import renderHTML from './react-router-middleware-html';

import {entry, output} from '../webpack.config.babel/'

export default async function ReactRouterMiddleware(ctx, next) {
    const [error, redirectLocation, renderProps] = await new Promise(res =>
        match({routes, location: ctx.req.url}, (...args) => res(args)));

    if (!error && !redirectLocation && !renderProps)
        return next();
    
    if (error)
        Object.assign(ctx, {status: 500, body: error.message});
    else if (redirectLocation)
        ctx.redirect(redirectLocation.pathname + redirectLocation.search);
    else if (renderProps)
        ctx.body = renderHTML(renderToString(<RouterContext {...renderProps} />),
            Object.keys(entry).map(entry => output.filename.replace('[name]', entry)));
};
