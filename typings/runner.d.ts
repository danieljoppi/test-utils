/// <reference types="deep-diff" />
export interface ErrorOpts {
    errorFilter?: string;
    verbose?: boolean;
}
export interface TestRunnerOpts {
    bail?: boolean;
}
export interface addFnT {
    (description: string, fn: () => void): void;
    (description: string, fn: () => Promise<any>): void;
}
export declare class Runner {
    private opts;
    constructor(opts?: ErrorOpts & TestRunnerOpts);
    $queue: {
        description: string;
        fn: Function;
    }[];
    $initqueue: {
        description: string;
        fn: Function;
    }[];
    $failed: string[];
    run(): Promise<any>;
    init: addFnT;
    add: addFnT;
    only: addFnT;
}
export interface TestError extends Error {
    changes?: deepDiff.IDiff[];
    casename: string;
}
