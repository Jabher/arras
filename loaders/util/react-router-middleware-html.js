const React = require('react');
const {RouterContext} = require('react-router');
const {combineReducers} = require('redux');
const {Provider} = require('react-redux');
const {renderToString, renderToStaticMarkup} = require('react-dom/server');
const Helmet = require('react-helmet');
var path = require('path');


module.exports = function renderer({entry, output, context}) {
    //todo make store compileable by webpack
    const storeCreatorPath = path.resolve(context, entry.storeCreator);
    const store = require(storeCreatorPath).default();

    return function renderToHTML(renderProps) {
        const scripts = Object.keys(entry)
            .map(entry => output.filename.replace('[name]', entry))
            .map((entry, i) => React.createElement('script', { key: i, src: entry }));

        const contents = renderToString(React.createElement(
            Provider,
            { store: store },
            React.createElement(RouterContext, renderProps)
        ));

        const head = Helmet.rewind();
        const attrs = head.htmlAttributes.toComponent();

        return `<!DOCTYPE html>${renderToStaticMarkup(React.createElement(
            "html",
            attrs,
            React.createElement(
                "head",
                null,
                React.createElement("meta", { charSet: "utf-8" }),
                React.createElement("meta", { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
                head.title.toComponent(),
                head.meta.toComponent(),
                head.link.toComponent()
            ),
            React.createElement(
                "body",
                null,
                React.createElement("div", { id: "root", dangerouslySetInnerHTML: { __html: contents } }),
                scripts
            )
        ))}`;
    }
}
