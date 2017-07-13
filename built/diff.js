"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ono = require("ono");
const deepDiff = require("deep-diff");
function compare(input) {
    var changes = deepDiff.diff(input.response, input.expected);
    return _listChanges(changes, input.ignoreFields);
}
exports.compare = compare;
function assertDiff(input) {
    var { changesFiltered, isOk } = compare(input);
    if (!isOk) {
        throw ono({ expected: input.expected, changes: changesFiltered }, 'Diff error.');
    }
}
exports.assertDiff = assertDiff;
function _listChanges(diffobj = [], ignoreFields = []) {
    //string case is a shorthand for the more generic function description
    const ignoreFieldsFn = ignoreFields.map(field => {
        if (Array.isArray(field))
            //if path is the same, ignore = true
            return (path) => {
                for (var x = 0; x < field.length; x++) {
                    if (path[x] === field[x])
                        continue;
                    if (path[x] === '[]' || path[x] === '*')
                        continue;
                    return false;
                }
                return true;
            };
        return field;
    });
    var changesFiltered = diffobj.filter(c => {
        if (c.path) {
            let ignoreAny = ignoreFieldsFn.some(ignoreFn => ignoreFn(c.path));
            return !ignoreAny;
        }
        return true;
    });
    var isOk = changesFiltered.length === 0;
    return { changesFiltered, isOk };
}
exports._listChanges = _listChanges;
function printDiff(diffObj) {
    var kindmap = {
        N: 'aditional element',
        D: 'extra element',
        E: 'different value',
        A: 'difference in array'
    };
    var { kind, path, lhs, rhs, index, item } = diffObj;
    console.error(kindmap[kind]);
    if (path)
        console.error('at:', path.join(' > '));
    if (index)
        console.error('index:', index);
    if (rhs !== undefined)
        console.error('expected:', rhs, typeof rhs);
    if (lhs !== undefined)
        console.error('got:', lhs, typeof lhs);
    if (item)
        console.error('item:', item);
    console.error('-----');
}
exports.printDiff = printDiff;
