import {match} from 'react-router';
import routes from '../webapp/routes';
import render from './util/react-router-middleware-html';

export default async function ReactRouterMiddleware(ctx, next) {
    const [error, redirectLocation, renderProps] = await new Promise(res =>
        match({routes, location: ctx.req.url}, (...args) => res(args)));

    if (error)
        Object.assign(ctx, {status: 500, body: error.message});
    else if (redirectLocation)
        ctx.redirect(redirectLocation.pathname + redirectLocation.search);
    else if (renderProps)
        ctx.body = render(renderProps);
    else
        await next();
};
