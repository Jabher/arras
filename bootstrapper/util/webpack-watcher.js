import webpack from 'webpack';
import MemoryFS from 'memory-fs';

import EventEmitter from 'events';
import config from 'config';

import fetch from 'node-fetch';

import {context, output, module} from '../../webpack.config.babel';

export default function watch(path) {
    const buildEventEmitter = new EventEmitter();
    let compiledModule = null;
    let compileSuccessFlag = false;
    buildEventEmitter.on('built', () => compiledModule = generate());
    buildEventEmitter.on('reset', () => {
        compiledModule = null;
        compileSuccessFlag = false;
    });

    const webpackCompiler = webpack({
        context, output, module, plugins: [new webpack.DefinePlugin({
            'process.env.NODE_ENV': config.env.dev ? '"development"' : '"production"',
            __DEV__: String(config.env.dev)
        })], target: 'node',
        entry: {index: `./${require('path').relative(context, path)}`}
    });

    webpackCompiler.outputFileSystem = new MemoryFS();
    webpackCompiler.plugin('invalid', invalidPlugin);
    webpackCompiler.plugin('watch-run', asyncInvalidPlugin);
    webpackCompiler.plugin('run', asyncInvalidPlugin);


    webpackCompiler.watch({aggregateTimeout: 200}, (err) => { if (err) console.error(err); });

    webpackCompiler.plugin('done', () => {
        compileSuccessFlag = true;
        process.nextTick(() => {
            if (compileSuccessFlag)
                buildEventEmitter.emit('built');
        });
    });

    return () => compiledModule
        ? Promise.resolve(compiledModule)
        : new Promise(res => buildEventEmitter.on('built', () => res(generate())));

    function generate(force = false) {
        return (!force && compiledModule) ||
            (compiledModule = evaluate(webpackCompiler.outputFileSystem.readFileSync('/index.js').toString()));
    }

    function evaluate(file) {
        eval(file)
    }

    function invalidPlugin() {
        buildEventEmitter.emit('reset');
    }

    function asyncInvalidPlugin(compiler, callback) {
        buildEventEmitter.emit('reset');
        callback();
    }
};