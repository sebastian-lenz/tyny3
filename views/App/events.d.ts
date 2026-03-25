import type { Param, Url } from '../../utils/classes/Url';
export interface ContentEventDetails {
    url: Url;
    isForward: boolean | undefined;
    markup: string;
    request?: Promise<any>;
}
export interface LoadEventDetails {
    url: Url;
}
export interface NavigateEventDetails {
    params: tyny.Map<tyny.Map<Param>>;
    url: Url;
}
export declare const beginLoadEvent = "tyny:appBeginLoad";
export declare const contentEvent = "tyny:appContent";
export declare const endLoadEvent = "tyny:appEndLoad";
export declare const linkEvent = "tyny:appLink";
export declare const loadEvent = "tyny:appLoad";
export declare const navigateEvent = "tyny:appNavigate";
