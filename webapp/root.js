import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';

import {reducer, storeCreator} from './storeCreator';
import {routes} from './routes';

const store = storeCreator(reducer);

if (__DEV__ && module.hot)
    module.hot.accept('./storeCreator', () =>
        store.replaceReducer(require('./storeCreator').reducer));

export default class Root extends Component {
    render() {
        return <Provider store={store}>
            <Router history={browserHistory}>{routes}</Router>
        </Provider>
    }
}