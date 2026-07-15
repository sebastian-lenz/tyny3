import * as events from './events';
import { Behaviour } from '../../core/Behaviour';
import { createElement } from '../../utils/dom/node/createElement';
import { event, getClassNamePrefix } from '../../core';
import type { App } from './index';
import type { BehaviourOptions } from '../../core/Behaviour';
import type { CreateElementOptions } from '../../utils/dom/node/createElement';

function getApp(this: ProgressBehaviour) {
  return this.view.el;
}

export interface ProgressBehaviourOptions extends BehaviourOptions {
  progress?: CreateElementOptions;
}

export class ProgressBehaviour extends Behaviour<App> {
  createOptions: CreateElementOptions;
  current: HTMLElement | null = null;

  constructor(view: App, options: ProgressBehaviourOptions) {
    super(view, options);

    this.createOptions = {
      appendTo: document.body,
      className: `${getClassNamePrefix()}App__progress`,
      tagName: 'div',
      ...(options.progress || {}),
    };
  }

  @event({ name: events.beginLoadEvent, target: getApp })
  onBeginLoad() {
    this.onEndLoad();

    const element = (this.current = createElement(this.createOptions));
    setTimeout(() => element.classList.add('started'), 0);
  }

  @event({ name: events.endLoadEvent, target: getApp })
  onEndLoad() {
    const { current: element } = this;
    this.current = null;

    if (element) {
      element.classList.remove('started');
      element.classList.add('finished');
      setTimeout(() => element.classList.add('fadeOut'), 300);
      setTimeout(() => element.remove(), 600);
    }
  }
}
