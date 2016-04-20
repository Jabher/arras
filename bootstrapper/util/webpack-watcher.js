import EventEmitter from 'events'

const aggregateTimeout = 200;

export default function watch(compiler) {
    const buildEventEmitter = new EventEmitter();
    compiler.plugin('invalid', invalidPlugin);
    compiler.plugin('watch-run', asyncInvalidPlugin);
    compiler.plugin('run', asyncInvalidPlugin);

    var compileSuccessFlag = false;

    buildEventEmitter.on('reset', () => compileSuccessFlag = false);

    const watchdog = compiler.watch({aggregateTimeout}, (err) => { if (err) console.error(err); });

    compiler.plugin('done', () => {
        compileSuccessFlag = true;
        process.nextTick(() => {
            if (compileSuccessFlag)
                buildEventEmitter.emit('built');
        });
    });

    buildEventEmitter.close = ::watchdog.close;

    return buildEventEmitter;

    function invalidPlugin() {
        buildEventEmitter.emit('reset');
    }

    function asyncInvalidPlugin(compiler, callback) {
        buildEventEmitter.emit('reset');
        callback();
    }
};