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

export const beginLoadEvent = 'tyny:appBeginLoad';
export const contentEvent = 'tyny:appContent';
export const endLoadEvent = 'tyny:appEndLoad';
export const linkEvent = 'tyny:appLink';
export const loadEvent = 'tyny:appLoad';
export const navigateEvent = 'tyny:appNavigate';
