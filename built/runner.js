"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diff_1 = require("./diff");
class Runner {
    constructor(opts = {}) {
        this.opts = opts;
        this.$queue = [];
        this.$initqueue = [];
        this.$failed = [];
        this.init = (description, fn) => {
            this.$initqueue.push({ description, fn });
        };
        this.test = (description, fn) => {
            this.$queue.push({ description, fn });
        };
        this.only = (description, fn) => {
            console.warn('RUN ONLY: ', description);
            this.$queue = [{ description, fn }];
        };
    }
    run() {
        let that = this;
        return [...this.$initqueue, ...this.$queue].reduce((chain, current, idx) => {
            return chain.then(() => {
                console.log(`${idx}. ${current.description}`);
                return current.fn()
                    .then(() => console.log('OK'))
                    .catch((err) => {
                    err.casename = current.description;
                    throw err;
                });
            });
        }, Promise.resolve()).catch(err => {
            that.$failed.push(err.casename || '');
            handleError(err, that.opts);
            if (that.opts.bail)
                throw 'Bail on error.';
        });
    }
}
exports.Runner = Runner;
function handleError(err, params) {
    var { errorFilter, verbose } = params;
    if (err.casename)
        console.error(`FAIL ON -- ${err.casename}`);
    if (err.changes) {
        if (err.changes.length && errorFilter) {
            err.changes = err.changes.filter(item => {
                if (!item.path)
                    return;
                let pathStr = item.path.join('.');
                return errorFilter ? pathStr.endsWith(errorFilter) : false;
            });
        }
        if (err.changes.length > 3 && !verbose) {
            err.changes = err.changes.slice(0, 3);
            console.log(' -- More than 3 differences. Omitting some results... -- '.red);
        }
        err.changes.forEach(e => diff_1.printDiff(e));
    }
    else
        console.error(err);
}
