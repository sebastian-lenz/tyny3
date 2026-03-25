import { apply } from '../../../utils/dom/node/apply';
import { getViews } from '../../../core';
export function applySleep(el) {
    apply(el, (el) => Object.values(getViews(el))
        .filter((view) => 'onSleep' in view)
        .forEach((view) => view.onSleep()));
}
