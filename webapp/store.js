import {createStore, compose, applyMiddleware} from 'redux';

const storeCreator = compose(
    applyMiddleware(
        ({dispatch, getState}) => next => action =>
            action instanceof Function
                ? action(dispatch, getState)
                : next(action)),
    ...(window.devToolsExtension
        ? [window.devToolsExtension()]
        : []))(createStore);

const store = storeCreator(require('./reducer').default);

export default store

if (__DEV__ && module.hot)
    module.hot.accept('./reducer', () =>
        store.replaceReducer(require('./reducer').default));
