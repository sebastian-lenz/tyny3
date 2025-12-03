import { __rest } from "tslib";
import { closest } from '../node/closest';
import { findAll } from '../node/find';
import { isElement } from '../misc/isElement';
import { toEventTargets } from './toEventTargets';
import { within } from '../node/within';
function delegate(delegates, selector, listener) {
    return function (event) {
        delegates.forEach((delegate) => {
            const current = selector[0] === '>' && isElement(delegate)
                ? findAll(selector, delegate)
                    .reverse()
                    .filter((element) => within(event.target, element))[0]
                : closest(event.target, selector);
            if (current) {
                event.delegate = delegate;
                event.current = current;
                listener.call(this, event);
            }
        });
    };
}
function detail(listener) {
    return function (event) {
        event instanceof CustomEvent && Array.isArray(event.detail)
            ? listener(event, ...event.detail)
            : listener(event);
    };
}
function selfFilter(listener) {
    return function (event) {
        if (event.target === event.currentTarget) {
            return listener(event);
        }
    };
}
export function on(target, type, listener, _a = {}) {
    var { selector, self, scope } = _a, options = __rest(_a, ["selector", "self", "scope"]);
    const targets = toEventTargets(target);
    if (scope) {
        listener = listener.bind(scope);
    }
    if (listener.length > 1) {
        listener = detail(listener);
    }
    if (self) {
        listener = selfFilter(listener);
    }
    if (selector) {
        listener = delegate(targets, selector, listener);
    }
    type
        .split(' ')
        .forEach((type) => targets.forEach((target) => target.addEventListener(type, listener, options)));
    return function () {
        off(targets, type, listener, options);
    };
}
export function off(target, type, listener, options = false) {
    const targets = toEventTargets(target);
    type
        .split(' ')
        .forEach((type) => targets.forEach((target) => target.removeEventListener(type, listener, options)));
}
