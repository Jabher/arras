var expressMiddleware = require('webpack-dev-middleware');

function middleware(doIt, req, res) {
    var originalEnd = res.end;

    return function (done) {
        res.end = function () {
            originalEnd.apply(this, arguments);
            done(null, 0);
        };
        doIt(req, res, function () {
            done(null, 1);
        })
    }
}

module.exports = function (compiler, option) {
    var doIt = expressMiddleware(compiler, option);
    const result = function*(next) {
        var ctx = this;
        var req = this.req;
        var runNext = yield middleware(doIt, req, {
            end (content) { ctx.body = content; },
            setHeader () { ctx.set.apply(ctx, arguments); }
        });
        if (runNext) {
            yield *next;
        }
    };

    for (const key of Object.keys(doIt))
        if (doIt[key] instanceof Function)
            result[key] = doIt[key].bind(doIt);

    return result
};