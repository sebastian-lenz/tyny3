import { Swap, type SwapOptions } from '../Swap';
export interface AriaTabsOptions extends SwapOptions {
}
export declare class AriaTabs extends Swap {
    currentTab: HTMLElement | null;
    get tabs(): HTMLElement[];
    constructor(options: AriaTabsOptions);
    onKeyDown(event: KeyboardEvent): void;
    onTabClick(event: tyny.DelegateEvent): void;
    setCurrentTab(value: HTMLElement | null): void;
}
