import React from 'react'
import {RouterContext} from 'react-router';
import {combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import Helmet from 'react-helmet';


export default function renderer(config, {entry, output}) {
    const storeCreatorPath = `${config.paths.webappDir}/_util/store`;
    const reducersPath = `${config.paths.webappDir}/reducers`;

    //noinspection JSFileReferences
    const reducer = combineReducers(require('fs').readdirSync(reducersPath)
        .filter(file => file.endsWith('.js'))
        .reduce((acc, file) => ({
            ...acc,
            [file.replace(/\.js$/, '')]: require(`${reducersPath}/${file}`).default
        }), {}));

    const store = require(storeCreatorPath).default(reducer);

    return function renderToHTML(renderProps) {
        const scripts = Object.keys(entry)
            .map(entry => output.filename.replace('[name]', entry))
            .map((entry, i) => <script key={i} src={entry}></script>);

        const contents = renderToString(<Provider store={store}><RouterContext {...renderProps} /></Provider>);

        const head = Helmet.rewind();
        const attrs = head.htmlAttributes.toComponent();

        return `<!DOCTYPE html>${renderToStaticMarkup(<html {...attrs}>
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            {head.title.toComponent()}
            {head.meta.toComponent()}
            {head.link.toComponent()}
        </head>
        <body>
        <div id="root" dangerouslySetInnerHTML={{__html: contents}}></div>
        {scripts}
        </body>
        </html>)}`;
    }
}
