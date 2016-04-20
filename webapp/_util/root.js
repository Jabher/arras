import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';

import storeCreator from './store';
import routes from '../routes';

const store = storeCreator(require('./reducer').default);

if (__DEV__ && module.hot)
    module.hot.accept('./reducer', () =>
        store.replaceReducer(require('./reducer').default));

/*this component should be untouched
 same routing component is used on back-end and should be changed simulateously*/
export default class Root extends Component {
    render() {
        return <Provider store={store}>
            <Router history={browserHistory}>{routes}</Router>
        </Provider>
    }
}