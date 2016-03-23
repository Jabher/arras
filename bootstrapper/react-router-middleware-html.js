import React, {Component, PropTypes} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

class Html extends Component {
    static propTypes = {
        bodyHTML: PropTypes.string,
        scripts: PropTypes.arrayOf(PropTypes.element)
    };

    render() {
        return <html>
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="description" content=""/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </head>
        <body>
            <div id="root" dangerouslySetInnerHTML={{__html: this.props.bodyHTML}}/>
            {this.props.scripts}
        </body>
        </html>
    }
}

export default (body, scripts) => `<!DOCTYPE html>${
    renderToStaticMarkup(<Html
        bodyHTML={body}
        scripts={scripts.map(entry => <script 
            key={entry}
            src={entry}></script>)}/>)}`