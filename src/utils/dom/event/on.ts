import { closest } from '../node/closest';
import { findAll } from '../node/find';
import { isElement } from '../misc/isElement';
import { toEventTargets, EventTargetLike } from './toEventTargets';
import { within } from '../node/within';

export interface OnOptions extends AddEventListenerOptions {
  self?: boolean;
  selector?: string;
  scope?: any;
}

type VoidCallback = () => void;

function delegate(
  delegates: EventTarget[],
  selector: string,
  listener: Function
): Function {
  return function (this: any, event: any) {
    delegates.forEach((delegate) => {
      const current =
        selector[0] === '>' && isElement(delegate)
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

function detail(listener: Function): Function {
  return function (event: Event) {
    event instanceof CustomEvent && Array.isArray(event.detail)
      ? listener(event, ...event.detail)
      : listener(event);
  };
}

function selfFilter(listener: Function): Function {
  return function (event: Event) {
    if (event.target === event.currentTarget) {
      return listener(event);
    }
  };
}

export function on(
  target: EventTargetLike | EventTargetLike[],
  type: string,
  listener: Function,
  { selector, self, scope, ...options }: OnOptions = {}
): VoidCallback {
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
    .forEach((type) =>
      targets.forEach((target) =>
        target.addEventListener(type, listener as any, options)
      )
    );

  return function () {
    off(targets, type, listener, options);
  };
}

export function off(
  target: EventTargetLike | EventTargetLike[],
  type: string,
  listener: Function,
  options: EventListenerOptions | boolean = false
) {
  const targets = toEventTargets(target);

  type
    .split(' ')
    .forEach((type) =>
      targets.forEach((target) =>
        target.removeEventListener(type, listener as any, options)
      )
    );
}
