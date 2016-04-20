import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';

export default class Index extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    render() {
        return <div>
            <Helmet title="Platyboost"
                    meta={[
                        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                        {name: 'description', content: 'Helmet application'}
                    ]}/>
            {this.props.children}
        </div>
    }
}