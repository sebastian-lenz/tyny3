export interface Step {
    index: number;
    name: string;
    query: string;
}
export declare const eventBreakpointsChanged = "tyny:breakpointsChanged";
export declare class Breakpoints {
    readonly defaultStep: Step;
    current: Step;
    readonly steps: Array<Step & {
        media: MediaQueryList;
    }>;
    constructor(defaultStep: Step, steps: Array<Step>);
    onMediaChanged: () => void;
    setCurrent(current: Step): void;
}
