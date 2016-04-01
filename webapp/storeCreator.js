/*
 * IMPORTANT: 
 * Do not move or change signature of this file.
 * This file is also used by back-end HTML compiler 
 * and is expected be in this place and to have default export of storeCreator and export of core reducer
 */

import {createStore, compose, applyMiddleware, combineReducers} from 'redux';

export const storeCreator = compose(
    applyMiddleware(
        ({dispatch, getState}) => next => action =>
            action instanceof Function
                ? action(dispatch, getState)
                : next(action)),
    ...(global.devToolsExtension
        ? [global.devToolsExtension()]
        : []))(createStore);

const reducersContext = require.context('./reducers', false, /^\.\/([^\/])*\.js/);

export const reducer = combineReducers(reducersContext.keys()
    .reduce((acc, key) => ({
            ...acc,
            [/^\.\/([^\/]*)\.js/.exec(key)[1]]: reducersContext(key).default
        }),
        {}));
