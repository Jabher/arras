import React from 'react'
import {RouterContext} from 'react-router';
import {entry, output} from '../../webpack.config.babel/'
import {Provider} from 'react-redux';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';

//noinspection Eslint - due to unavoidable dangerouslySetInnerHTML usage
const HTMLContainer = ({app, store, children: scripts}) =>
    <html>
    <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="description" content=""/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
    <body>
    <div id="root" dangerouslySetInnerHTML={{__html: renderToString(<Provider store={store}>{app}</Provider>)}}></div>
    {scripts}
    </body>
    </html>;

export default function renderToHTML(renderProps, store) {
    const scripts = Object.keys(entry)
        .map(entry => output.filename.replace('[name]', entry))
        .map((entry, i) => <script key={i} src={entry}></script>);

    const routerContext = <RouterContext {...renderProps} />;

    return `<!DOCTYPE html>${renderToStaticMarkup(<HTMLContainer app={routerContext} store={store}>{scripts}</HTMLContainer>)}`;
}