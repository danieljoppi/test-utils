declare var _default: (params?: {
    errorFilter?: string | undefined;
    just?: string | undefined;
    skip?: string[] | undefined;
    doNotBreak?: boolean | undefined;
    verbose?: boolean | undefined;
}) => {
    add: {
        (description: string, fn: () => void): any;
        (description: string, fn: () => Promise<any>): any;
    };
    run: () => Promise<void>;
    diff: (response: {}, expected: {}, ignoreFields?: string[] | undefined) => void;
};
export = _default;
