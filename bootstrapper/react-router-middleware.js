import config from 'config';
import {match} from 'react-router';
import render from './util/react-router-middleware-html';
import watcher from './util/webpack-watcher';

const recompilingRouter = watcher(`${config.paths.webappDir}/routes.js`);
const recompilingStore = watcher(`${config.paths.webappDir}/storeCreator.js`);


export default async function ReactRouterMiddleware(ctx, next) {
    const {routes} = await recompilingRouter();
    const {storeCreator, reducer} = await recompilingStore();

    const [error, redirectLocation, renderProps] = await new Promise(res =>
        match({routes, location: ctx.req.url}, (...args) => res(args)));

    if (error)
        Object.assign(ctx, {status: 500, body: error.message});
    else if (redirectLocation)
        ctx.redirect(redirectLocation.pathname + redirectLocation.search);
    else if (renderProps) {
        ctx.body = render(renderProps, storeCreator(reducer));

    } else
        await next();
};
