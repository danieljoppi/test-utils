/// <reference types="deep-diff" />
export declare type IIgnoreFields = ((i: string[]) => boolean) | string[];
export interface IDiffInput<T> {
    response: T;
    expected: T;
    ignoreFields?: IIgnoreFields[];
}
export declare function compare<T>(input: IDiffInput<T>): {
    changesFiltered: deepDiff.IDiff[];
    isOk: boolean;
};
export declare function assertDiff<T>(input: IDiffInput<T>): void;
export declare function _listChanges(diffobj?: deepDiff.IDiff[], ignoreFields?: IIgnoreFields[]): {
    changesFiltered: deepDiff.IDiff[];
    isOk: boolean;
};
export declare function printDiff(diffObj: deepDiff.IDiff): void;
