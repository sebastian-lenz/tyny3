import { apply } from '../../../utils/dom/node/apply';
import { getViews } from '../../../core';

export interface Sleepable extends tyny.View {
  onSleep(): void;
}

export function applySleep(el: HTMLElement) {
  apply(el, (el) =>
    Object.values(getViews(el))
      .filter((view): view is Sleepable => 'onSleep' in view)
      .forEach((view) => view.onSleep())
  );
}
