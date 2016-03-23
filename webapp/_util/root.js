import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';

import storeCreator from './store';
import routes from '../routes';

const store = storeCreator(require('./reducer').default);

if (__DEV__ && module.hot)
    module.hot.accept('./reducer', () =>
        store.replaceReducer(require('./reducer').default));

export default class Root extends Component {
    render() {
        return <Provider store={store}>
            <Router history={browserHistory}>{routes}</Router>
        </Provider>
    }
}