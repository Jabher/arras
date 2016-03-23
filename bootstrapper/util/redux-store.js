import config from 'config';
import {combineReducers} from 'redux';
import storeCreator from '../../webapp/_util/store';

var reducersPath = `${config.paths.webappDir}/reducers`;

//noinspection JSFileReferences
const reducer = combineReducers(require('fs').readdirSync(reducersPath)
    .filter(file => file.endsWith('.js'))
    .reduce((acc, file) => ({...acc, [file.replace(/\.js$/, '')]: require(`${reducersPath}/${file}`).default}), {}));


export default storeCreator(reducer);