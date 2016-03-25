import EventEmitter from 'events'

export default function watch(compiler) {
    const buildEventEmitter = new EventEmitter();
    compiler.plugin('invalid', invalidPlugin);
    compiler.plugin('watch-run', asyncInvalidPlugin);
    compiler.plugin('run', asyncInvalidPlugin);

    var compileSuccessFlag = false;

    buildEventEmitter.on('reset', () => compileSuccessFlag = false);

    compiler.watch({aggregateTimeout: 200}, (err) => { if (err) console.error(err); });

    compiler.plugin('done', () => {
        compileSuccessFlag = true;
        process.nextTick(() => {
            if (compileSuccessFlag)
                buildEventEmitter.emit('built');
        });
    });

    return buildEventEmitter;

    function invalidPlugin() {
        buildEventEmitter.emit('reset');
    }

    function asyncInvalidPlugin(compiler, callback) {
        buildEventEmitter.emit('reset');
        callback();
    }
};