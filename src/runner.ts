import { printDiff } from './diff'

export interface ErrorOpts {
    errorFilter?: string
    verbose?: boolean
    //[x: string]: any
}
export interface TestRunnerOpts {
    bail?: boolean
    //[x: string]: any
}


export interface addFnT {
    (description: string, fn: () => void): void
    (description: string, fn: () => Promise<any>): void
}

export class Runner {

    constructor(private opts:ErrorOpts & TestRunnerOpts = {}) {}

    $queue: { description: string, fn: Function }[] = []
    $initqueue: { description: string, fn: Function }[] = []
    $failed: string[] = []

    run() {
        let that = this
        return [...this.$initqueue, ...this.$queue].reduce(
            (chain, current, idx) => {
                return chain.then(() => {
                    console.log(`${idx}. ${current.description}`)
                    return current.fn()
                        .then(() => console.log('OK'))
                        .catch((err: any) => {
                            err.casename = current.description
                            throw err
                        })
                })
            },
            Promise.resolve()
        ).catch(err => {
            that.$failed.push(err.casename || '');
            handleError(err, that.opts)
            if (that.opts.bail) throw 'Bail on error.'
        })
    }


    init : addFnT = (description: string, fn: Function) => {
        this.$initqueue.push({ description, fn })
    }


    add: addFnT = (description: string, fn: Function) => {
        this.$queue.push({ description, fn })
    }


    only: addFnT = (description: string, fn: Function) => {
        console.warn('RUN ONLY: ', description)
        this.$queue = [{ description, fn }]
    }

}


export interface TestError extends Error {
    changes?: deepDiff.IDiff[]
    casename: string
}

function handleError(err: TestError, params: ErrorOpts) {
    var { errorFilter, verbose } = params

    if (err.casename) console.error(`FAIL ON -- ${err.casename}`)

    if (err.changes) {
        if (err.changes.length && errorFilter) {
            err.changes = err.changes.filter(item => {
                if (!item.path) return;
                let pathStr = item.path.join('.');
                return errorFilter ? pathStr.endsWith(errorFilter) : false
            });
        }
        if (err.changes.length > 3 && !verbose) {
            err.changes = err.changes.slice(0, 3);
            console.log(' -- More than 3 differences. Omitting some results... -- '.red);
        }
        err.changes.forEach(e => printDiff(e));
    }
    else console.error(err);
}
