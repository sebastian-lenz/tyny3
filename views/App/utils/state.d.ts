export type State = tyny.Map<any>;
export declare function getState<T>(key: string): T | null;
export declare function getViewState<T>(uuid: string): T | null;
export declare function modifyState(callback: (state: State) => State): void;
export declare function setViewState<T>(uuid: string, value: T): void;
