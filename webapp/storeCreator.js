import {createStore, compose, applyMiddleware} from 'redux';

const storeCreator = compose(
    applyMiddleware(
        ({dispatch, getState}) => next => action =>
            action instanceof Function
                ? action(dispatch, getState)
                : next(action)),
    ...(global.devToolsExtension
        ? [global.devToolsExtension()]
        : []))(createStore);

export default storeCreator;