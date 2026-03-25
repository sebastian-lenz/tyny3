import { __decorate } from "tslib";
import * as events from './events';
import { applySleep } from './utils/sleep';
import { event, property, View } from '../../core';
import { getScrollLeft } from '../../utils/dom/window/getScrollLeft';
import { getScrollTop } from '../../utils/dom/window/getScrollTop';
import { modifyState } from './utils/state';
import { trigger } from '../../utils/dom/event/trigger';
import { toBasePath } from './utils/path';
import { Url } from '../../utils/classes/Url';
import { resetScrollPosition, restoreScrollPosition, scrollToElement, } from './utils/scrolling';
export class App extends View {
    constructor(options) {
        super(options);
        this.cache = {};
        this.localParam = /^([a-z0-9]{3,4}-)(.*)$/;
        this.request = null;
        const url = new Url(window.location.href);
        this.basePath = toBasePath(window.location.href);
        this.url = url;
        if (this.useCache) {
            this.cache[this.toCacheKey(url)] = document.documentElement.outerHTML;
        }
    }
    createRequest(url) {
        return fetch(url.toString());
    }
    isLocalUrl(url) {
        return toBasePath(url.toString()) == this.basePath;
    }
    extractLocalParams(query) {
        const { localParam } = this;
        const result = {};
        Object.keys(query).forEach((key) => {
            const match = localParam.exec(key);
            if (!match)
                return;
            const [, scope, name] = match;
            if (!result[scope]) {
                result[scope] = {};
            }
            result[scope][name] = query[key];
        });
        return result;
    }
    filterLocalParams(query) {
        return Object.keys(query)
            .filter((key) => !this.localParam.test(key))
            .reduce((result, key) => (Object.assign(Object.assign({}, result), { [key]: query[key] })), {});
    }
    load(url, isForward) {
        const { cache } = this;
        const cacheKey = this.toCacheKey(url);
        if (cacheKey in cache) {
            return this.setContent(url, isForward, cache[cacheKey]);
        }
        const request = this.createRequest(url)
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
    getLocalParam(name) {
        const params = this.extractLocalParams(this.url.query);
        return name in params ? params[name] : {};
    }
    onHistory() {
        this.setUrl(new Url(window.location.href));
    }
    onLinkClick(event) {
        const href = event.current.href;
        const url = href ? new Url(href) : null;
        if (url && this.isAppLink(event.current, url)) {
            this.pushUrl(url);
            event.preventDefault();
            trigger(event.target, events.linkEvent);
        }
    }
    isAppLink(el, url) {
        return (this.isLocalUrl(url) &&
            !el.hasAttribute('target') &&
            !el.hasAttribute('download'));
    }
    pushLocalParam(localParam, values) {
        const query = Object.keys(this.url.query)
            .filter((key) => !key.startsWith(localParam))
            .reduce((result, key) => (Object.assign(Object.assign({}, result), { [key]: query[key] })), {});
        for (const key of Object.keys(values)) {
            query[`${localParam}${key}`] = values[key];
        }
        const url = this.url.clone();
        url.query = query;
        this.pushUrl(url);
    }
    pushUrl(url, state = {}) {
        if (this.url.toString() != url.toString()) {
            this.storeScrollPosition();
            window.history.pushState(Object.assign(Object.assign({}, state), { allowBack: true }), '', url.toString());
            this.setUrl(url, true);
        }
        else if (url.fragment) {
            this.scrollToAnchor(url.fragment);
        }
    }
    setContent(url, isForward, markup, request) {
        if (isForward) {
            resetScrollPosition(url);
        }
        else {
            restoreScrollPosition();
        }
        this.trigger(events.contentEvent, {
            url,
            isForward,
            markup,
            request,
        });
    }
    scrollToAnchor(id) {
        scrollToElement(document.getElementById(id));
    }
    setUrl(url, isForward) {
        if (this.toCacheKey(url) !== this.toCacheKey(this.url)) {
            applySleep(this.sleepRoot);
            trigger(window, events.loadEvent, {
                url,
            });
            this.load(url, isForward);
        }
        else {
            trigger(window, events.navigateEvent, {
                params: this.extractLocalParams(url.query),
                url,
            });
            if (url.fragment) {
                this.scrollToAnchor(url.fragment);
            }
        }
        this.url = url;
    }
    storeScrollPosition() {
        modifyState((state) => (Object.assign(Object.assign({}, state), { scrollPosition: {
                top: getScrollTop(),
                left: getScrollLeft(),
            } })));
    }
    toCacheKey(url) {
        return Url.compose({
            path: url.path,
            query: this.filterLocalParams(url.query),
        });
    }
}
__decorate([
    property({ param: { defaultValue: ':scope', type: 'element' } })
], App.prototype, "sleepRoot", void 0);
__decorate([
    property({ param: { defaultValue: true, type: 'bool' } })
], App.prototype, "useCache", void 0);
__decorate([
    event({ name: 'popstate', target: window })
], App.prototype, "onHistory", null);
__decorate([
    event({ name: 'click', selector: 'a' })
], App.prototype, "onLinkClick", null);
