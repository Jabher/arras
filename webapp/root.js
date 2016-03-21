import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import store from './store';

import IndexPage from './components/index_page'

export default class Root extends Component {
    render() {
        return <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/">
                    <IndexRoute component={IndexPage}/>
                </Route>
            </Router>
        </Provider>
    }
} 