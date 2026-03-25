import { View } from '../../core';
import { Url, type Param } from '../../utils/classes/Url';
import type { ViewOptions } from '../../core';
export interface AppOptions extends ViewOptions {
    useCache?: boolean;
}
export declare class App extends View {
    basePath: string;
    cache: tyny.Map<string>;
    localParam: RegExp;
    request: Promise<any> | null;
    url: Url;
    sleepRoot: HTMLElement;
    useCache: boolean;
    constructor(options: AppOptions);
    createRequest(url: Url): Promise<Response>;
    isLocalUrl(url: Url): boolean;
    extractLocalParams(query: tyny.Map<Param>): tyny.Map<tyny.Map<Param>>;
    filterLocalParams(query: tyny.Map<Param>): tyny.Map<Param>;
    load(url: Url, isForward?: boolean): void;
    getLocalParam(name: string): tyny.Map<Param>;
    onHistory(): void;
    onLinkClick(event: tyny.DelegateEvent): void;
    isAppLink(el: HTMLElement, url: Url): boolean;
    pushLocalParam(localParam: string, values: tyny.Map<Param>): void;
    pushUrl(url: Url, state?: any): void;
    setContent(url: Url, isForward: boolean | undefined, markup: string, request?: Promise<any>): void;
    scrollToAnchor(id: string): void;
    setUrl(url: Url, isForward?: boolean): void;
    storeScrollPosition(): void;
    toCacheKey(url: Url): string;
}
