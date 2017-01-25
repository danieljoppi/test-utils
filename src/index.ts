import ono = require('ono')
import deepDiff = require('deep-diff')

type Input = {
    errorFilter? : string
    just? : string
    skip?: string[]
    doNotBreak?: boolean
    verbose?: boolean
}

interface TestError extends Error {
    changes?
    casename: string
    bail?: boolean
}


export = function (params: Input = {}) {

    
    var __failed : string[] = []


    function handleError(err:TestError) {
        var { errorFilter, verbose } = params

        if (err.casename) console.error(`FAIL ON -- ${err.casename}`)

        if (err.changes) {
            if (err.changes.length && errorFilter) {
                err.changes = err.changes.filter( item => {
                    if (!item.path) return;
                    let pathStr = item.path.join('.');
                    return pathStr.endsWith(errorFilter)
                });
            }
            if (err.changes.length > 3 && !verbose) {
                err.changes = err.changes.slice(0,3);
                console.log(' -- More than 3 differences. Omitting some results... -- '.red);            
            }
            err.changes.forEach( e => printDiff(e) );
        }
        else console.error(err);
        //console.error('response>>', err.response);
        //console.error('expected>>', err.expected);
        if (err.bail) process.exit(0);
        else {
            __failed.push(err.casename||'');
        }
    }


    function printDiff(diffObj) {
        var kindmap = {
            N : 'aditional element' ,
            D : 'extra element' ,
            E : 'different value' ,
            A : 'difference in array'
        };
        
        var {kind,path,lhs,rhs,index,item} = diffObj;

        console.error( kindmap[kind] );
        if (path) console.error('at:', path.join(' > '));
        if (index) console.error('index:', index);
        if (rhs !== undefined) console.error('expected:' , rhs, typeof rhs);
        if (lhs !== undefined) console.error('got:' , lhs, typeof lhs);
        if (item) console.error('item:',item);
        console.error('-----');
    }
    

    function verifyChanges(diffobj: deepDiff.IDiff[], ignoreFields?) {
        ignoreFields = ignoreFields || [];
        diffobj = diffobj || [];
        ignoreFields = ignoreFields.map( fs => {
            return fs.split('.').filter( f => f );
        });
        var changesFiltered = diffobj.filter( c => {
            if (c.path) {
                let anyEqual = ignoreFields.some( fieldref => {
                    return !fieldref.some( (f,idx) => {
                        let thisField = c.path[idx];
                        if (f == '[]' /*&& !isNaN(parseInt(thisField))*/) return;
                        if (f != thisField) return true;
                    });
                });
                //if (anyEqual) console.log('filtering diff', c.path);
                return !anyEqual;
            }
            return true;
        });
        var isOk = changesFiltered.length === 0;
        return { changesFiltered , isOk };
    }


    function diff(response: {}, expected: {}, ignoreFields?:string[]) {
        var changes = deepDiff.diff(response, expected)
        var { changesFiltered, isOk } = verifyChanges(changes, ignoreFields)
        if (!isOk) throw ono({
            expected, changes: changesFiltered
        },'Diff error.')
    }

    var _queue: { description: string, fn: Function }[] = []

    
    function add(description: string, fn: () => void)    
    function add(description: string, fn: () => Promise<any>)    
    function add(description, fn) {
        _queue.push({description, fn})
    }

    function run() {
        return _queue.reduce(
            (chain, current, idx) => {
                return chain.then(() => {
                    console.log(`${idx}. ${current.description}`)
                    return current.fn()
                        .then(() => console.log('OK'))
                        .catch(err => {
                            err.casename = current.description
                            err.bail = !params.doNotBreak
                            throw err
                        })
                })
            },
            Promise.resolve()
        ).catch(err => {
            handleError(err)
        })
    }

    return {
        add,
        run,
        diff
    }
}