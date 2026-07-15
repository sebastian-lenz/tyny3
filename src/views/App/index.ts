import * as events from './events';
import { applySleep } from './utils/sleep';
import { event, property, View } from '../../core';
import { getScrollLeft } from '../../utils/dom/window/getScrollLeft';
import { getScrollTop } from '../../utils/dom/window/getScrollTop';
import { modifyState } from './utils/state';
import { trigger } from '../../utils/dom/event/trigger';
import { toBasePath } from './utils/path';
import { Url } from '../../utils/classes/Url';
import type { Param } from '../../utils/classes/Url';
import type { ViewOptions } from '../../core';

import {
  resetScrollPosition,
  restoreScrollPosition,
  scrollToElement,
} from './utils/scrolling';

export interface AppOptions extends ViewOptions {
  useCache?: boolean;
}

export class App extends View {
  basePath: string;
  cache: tyny.Map<string> = {};
  localParam = /^([a-z0-9]{3,4}-)(.*)$/;
  request: Promise<any> | null = null;
  url: Url;

  @property({ param: { defaultValue: ':scope', type: 'element' } })
  sleepRoot!: HTMLElement;

  @property({ param: { defaultValue: true, type: 'bool' } })
  useCache!: boolean;

  constructor(options: AppOptions) {
    super(options);

    const url = new Url(window.location.href);
    this.basePath = toBasePath(window.location.href);
    this.url = url;

    if (this.useCache) {
      this.cache[this.toCacheKey(url)] = document.documentElement.outerHTML;
    }
  }

  createRequest(url: Url): Promise<Response> {
    return fetch(url.toString());
  }

  isLocalUrl(url: Url): boolean {
    return toBasePath(url.toString()) == this.basePath;
  }

  extractLocalParams(query: tyny.Map<Param>): tyny.Map<tyny.Map<Param>> {
    const { localParam } = this;
    const result: tyny.Map<tyny.Map<Param>> = {};

    Object.keys(query).forEach((key) => {
      const match = localParam.exec(key);
      if (!match) return;

      const [, scope, name] = match;
      if (!result[scope]) {
        result[scope] = {};
      }

      result[scope][name] = query[key];
    });

    return result;
  }

  filterLocalParams(query: tyny.Map<Param>): tyny.Map<Param> {
    return Object.keys(query)
      .filter((key) => !this.localParam.test(key))
      .reduce((result, key) => ({ ...result, [key]: query[key] }), {});
  }

  load(url: Url, isForward?: boolean) {
    const { cache } = this;
    const cacheKey = this.toCacheKey(url);
    if (cacheKey in cache) {
      return this.setContent(url, isForward, cache[cacheKey]);
    }

    const request: Promise<any> = this.createRequest(url)
      .then((res) => res.text())
      .then((markup) => {
        if (this.useCache) {
          cache[cacheKey] = markup;
        }

        if (this.request == request) {
          this.request = null;
          this.trigger(events.endLoadEvent);
          this.setContent(url, isForward, markup, request);
        }
      })
      .catch(() => (window.location.href = url.toString()));

    this.request = request;
    this.trigger(events.beginLoadEvent);
  }

  getLocalParam(name: string): tyny.Map<Param> {
    const params = this.extractLocalParams(this.url.query);
    return name in params ? params[name] : {};
  }

  @event({ name: 'popstate', target: window })
  onHistory() {
    this.setUrl(new Url(window.location.href));
  }

  @event({ name: 'click', selector: 'a' })
  onLinkClick(event: tyny.DelegateEvent) {
    const href = (event.current as any).href;
    const url = href ? new Url(href) : null;

    if (url && this.isAppLink(event.current, url)) {
      this.pushUrl(url);
      event.preventDefault();
      trigger(event.target, events.linkEvent);
    }
  }

  isAppLink(el: HTMLElement, url: Url): boolean {
    return (
      this.isLocalUrl(url) &&
      !el.hasAttribute('target') &&
      !el.hasAttribute('download')
    );
  }

  pushLocalParam(localParam: string, values: tyny.Map<Param>): void {
    const query: tyny.Map<Param> = Object.keys(this.url.query)
      .filter((key) => !key.startsWith(localParam))
      .reduce((result, key) => ({ ...result, [key]: query[key] }), {});

    for (const key of Object.keys(values)) {
      query[`${localParam}${key}`] = values[key];
    }

    const url = this.url.clone();
    url.query = query;

    this.pushUrl(url);
  }

  pushUrl(url: Url, state: any = {}): void {
    if (this.url.toString() != url.toString()) {
      this.storeScrollPosition();

      window.history.pushState(
        { ...state, allowBack: true },
        '',
        url.toString()
      );

      this.setUrl(url, true);
    } else if (url.fragment) {
      this.scrollToAnchor(url.fragment);
    }
  }

  setContent(
    url: Url,
    isForward: boolean | undefined,
    markup: string,
    request?: Promise<any>
  ): void {
    if (isForward) {
      resetScrollPosition(url);
    } else {
      restoreScrollPosition();
    }

    this.trigger(events.contentEvent, {
      url,
      isForward,
      markup,
      request,
    } satisfies events.ContentEventDetails);
  }

  scrollToAnchor(id: string): void {
    scrollToElement(document.getElementById(id));
  }

  setUrl(url: Url, isForward?: boolean) {
    if (this.toCacheKey(url) !== this.toCacheKey(this.url)) {
      applySleep(this.sleepRoot);
      trigger(window, events.loadEvent, {
        url,
      } satisfies events.LoadEventDetails);

      this.load(url, isForward);
    } else {
      trigger(window, events.navigateEvent, {
        params: this.extractLocalParams(url.query),
        url,
      } satisfies events.NavigateEventDetails);

      if (url.fragment) {
        this.scrollToAnchor(url.fragment);
      }
    }

    this.url = url;
  }

  storeScrollPosition() {
    modifyState((state) => ({
      ...state,
      scrollPosition: {
        top: getScrollTop(),
        left: getScrollLeft(),
      },
    }));
  }

  toCacheKey(url: Url) {
    return Url.compose({
      path: url.path,
      query: this.filterLocalParams(url.query),
    });
  }
}
