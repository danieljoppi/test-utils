declare var _default: (params: {
    errorFilter?: string;
    just?: string;
    skip?: string[];
    doNotBreak?: boolean;
    verbose?: boolean;
}) => {
    add: {
        (description: string, fn: () => void): any;
        (description: string, fn: () => Promise<any>): any;
    };
    run: () => Promise<void>;
};
export = _default;
