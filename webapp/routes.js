import React from 'react';
import {Route, IndexRoute} from 'react-router';
import IndexPage from './components/index_page';
import HelloPage from './components/hello_page';

export default <Route path="/">
    <IndexRoute component={IndexPage}/>
    <Route path="/hello" component={HelloPage}/>
</Route>;