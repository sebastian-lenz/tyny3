import { Swap, type SwapOptions } from '../Swap';
export interface AriaTabsOptions extends SwapOptions {
    tabSelector?: string;
    tabListSelector?: string;
}
export declare class AriaTabs extends Swap {
    currentTab: HTMLElement | null;
    tabSelector: string;
    tabListSelector: string;
    get tabs(): HTMLElement[];
    constructor({ tabSelector, tabListSelector, ...options }: AriaTabsOptions);
    onKeyDown(event: KeyboardEvent): void;
    onTabClick(event: tyny.DelegateEvent): void;
    setCurrentTab(value: HTMLElement | null): void;
}
