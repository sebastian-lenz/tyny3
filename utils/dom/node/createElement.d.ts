export interface CreateElementOptions {
    appendTo?: HTMLElement;
    attributes?: {
        [name: string]: string;
    };
    children?: Array<string | Node>;
    className?: string;
    extraClassName?: string;
    prependTo?: HTMLElement;
    tagName?: string;
    template?: string | Function;
    text?: string;
}
export declare function createElement(options: CreateElementOptions): HTMLElement;
