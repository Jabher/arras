import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';

import {Provider} from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router';

import IndexPage from './components/index_page'

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path="/">
                <IndexRoute component={IndexPage}/>
            </Route>
        </Router>
    </Provider>,
    document.querySelector('#reactContainer'));