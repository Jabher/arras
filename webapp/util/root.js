import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';

import store from './store';
import routes from '../routes';

export default class Root extends Component {
    render() {
        return <Provider store={store}>
            <Router history={browserHistory}>{routes}</Router>
        </Provider>
    }
}