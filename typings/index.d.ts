export declare type Input = {
    errorFilter?: string;
    just?: string;
    skip?: string[];
    doNotBreak?: boolean;
    verbose?: boolean;
};
export declare function init(params: Input): {
    add: {
        (description: string, fn: () => void): any;
        (description: string, fn: () => Promise<any>): any;
    };
    run: () => Promise<void>;
};
