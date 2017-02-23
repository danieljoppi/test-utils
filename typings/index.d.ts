declare var _default: (params?: {
    errorFilter?: string | undefined;
    doNotBreak?: boolean | undefined;
    verbose?: boolean | undefined;
    printOnThrow?: boolean | undefined;
}) => {
    init: {
        (description: string, fn: () => void): any;
        (description: string, fn: () => Promise<any>): any;
    };
    add: {
        (description: string, fn: () => void): any;
        (description: string, fn: () => Promise<any>): any;
    };
    only: {
        (description: string, fn: () => void): any;
        (description: string, fn: () => Promise<any>): any;
    };
    run: () => Promise<void>;
    diff: (response: {}, expected: {}, ignoreFields?: string[] | undefined) => void;
};
export = _default;
