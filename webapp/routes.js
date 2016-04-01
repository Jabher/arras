/*
* IMPORTANT: 
* Do not move or change signature of this file.
* This file is also used by back-end HTML compiler 
* and is expected be in this place and to have default export of root route  
*/
import React from 'react';
import {Route, IndexRoute} from 'react-router';
import IndexPage from './components/index_page';
import HelloPage from './components/hello_page';

export const routes = <Route path="/">
    <IndexRoute component={IndexPage}/>
    <Route path="/hello" component={HelloPage}/>
</Route>;