import {combineReducers} from 'redux';

const reducersContext = require.context('../reducers', false, /^\.\/([^\/])*\.js/);

export default combineReducers(reducersContext.keys()
    .reduce((acc, key) => ({
            ...acc,
            [/^\.\/([^\/]*)\.js/.exec(key)[1]]: reducersContext(key).default
        }),
        {}));
