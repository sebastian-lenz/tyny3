import { Behaviour } from '../../core/Behaviour';
import type { App } from './index';
import type { BehaviourOptions } from '../../core/Behaviour';
import type { CreateElementOptions } from '../../utils/dom/node/createElement';
export interface ProgressBehaviourOptions extends BehaviourOptions {
    progress?: CreateElementOptions;
}
export declare class ProgressBehaviour extends Behaviour<App> {
    createOptions: CreateElementOptions;
    current: HTMLElement | null;
    constructor(view: App, options: ProgressBehaviourOptions);
    onBeginLoad(): void;
    onEndLoad(): void;
}
